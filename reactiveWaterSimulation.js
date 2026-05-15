import * as THREE from 'three';

const simulationVertexShader = `
attribute vec3 position;
varying vec2 coord;

void main() {
    coord = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xyz, 1.0);
}
`;

const dropFragmentShader = `
precision highp float;
precision highp int;

const float PI = 3.141592653589793;

uniform sampler2D texture;
uniform vec2 center;
uniform float radius;
uniform float strength;

varying vec2 coord;

void main() {
    vec4 info = texture2D(texture, coord);

    float drop = max(
        0.0,
        1.0 - length(center * 0.5 + 0.5 - coord) / radius
    );

    drop = 0.5 - cos(drop * PI) * 0.5;

    info.r += drop * strength;

    gl_FragColor = info;
}
`;

const updateFragmentShader = `
precision highp float;
precision highp int;

uniform sampler2D texture;
uniform vec2 delta;

varying vec2 coord;

void main() {
    vec4 info = texture2D(texture, coord);

    vec2 dx = vec2(delta.x, 0.0);
    vec2 dy = vec2(0.0, delta.y);

    float average = (
        texture2D(texture, coord - dx).r +
        texture2D(texture, coord - dy).r +
        texture2D(texture, coord + dx).r +
        texture2D(texture, coord + dy).r
    ) * 0.25;

    info.g += (average - info.r) * 2.0;
    info.g *= 0.995;
    info.r += info.g;

    gl_FragColor = info;
}
`;

const normalFragmentShader = `
precision highp float;
precision highp int;

uniform sampler2D texture;
uniform vec2 delta;

varying vec2 coord;

void main() {
    vec4 info = texture2D(texture, coord);

    vec3 dx = vec3(
        delta.x,
        texture2D(texture, vec2(coord.x + delta.x, coord.y)).r - info.r,
        0.0
    );

    vec3 dy = vec3(
        0.0,
        texture2D(texture, vec2(coord.x, coord.y + delta.y)).r - info.r,
        delta.y
    );

    info.ba = normalize(cross(dy, dx)).xz;

    gl_FragColor = info;
}
`;

export class ReactiveWaterSimulation {
    constructor(size = 256) {
        this.size = size;

        this.camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 2000);
        this.geometry = new THREE.PlaneGeometry(2, 2);

        this.textureA = new THREE.WebGLRenderTarget(size, size, {
            type: THREE.FloatType,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            depthBuffer: false,
            stencilBuffer: false
        });

        this.textureB = new THREE.WebGLRenderTarget(size, size, {
            type: THREE.FloatType,
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            depthBuffer: false,
            stencilBuffer: false
        });

        this.texture = this.textureA;

        this.dropMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                center: { value: new THREE.Vector2() },
                radius: { value: 0 },
                strength: { value: 0 },
                texture: { value: null }
            },
            vertexShader: simulationVertexShader,
            fragmentShader: dropFragmentShader
        });

        this.updateMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                delta: { value: new THREE.Vector2(1 / size, 1 / size) },
                texture: { value: null }
            },
            vertexShader: simulationVertexShader,
            fragmentShader: updateFragmentShader
        });

        this.normalMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                delta: { value: new THREE.Vector2(1 / size, 1 / size) },
                texture: { value: null }
            },
            vertexShader: simulationVertexShader,
            fragmentShader: normalFragmentShader
        });

        this.dropMesh = new THREE.Mesh(this.geometry, this.dropMaterial);
        this.updateMesh = new THREE.Mesh(this.geometry, this.updateMaterial);
        this.normalMesh = new THREE.Mesh(this.geometry, this.normalMaterial);
    }

    addDrop(renderer, x, z, radius = 0.03, strength = 0.04) {
        this.dropMaterial.uniforms.center.value.set(x, z);
        this.dropMaterial.uniforms.radius.value = radius;
        this.dropMaterial.uniforms.strength.value = strength;

        this.render(renderer, this.dropMesh);
    }

    step(renderer) {
        this.render(renderer, this.updateMesh);
    }

    updateNormals(renderer) {
        this.render(renderer, this.normalMesh);
    }

    render(renderer, mesh) {
        const oldTexture = this.texture;
        const newTexture =
            this.texture === this.textureA ? this.textureB : this.textureA;

        mesh.material.uniforms.texture.value = oldTexture.texture;

        renderer.setRenderTarget(newTexture);
        renderer.render(mesh, this.camera);
        renderer.setRenderTarget(null);

        this.texture = newTexture;
    }
}