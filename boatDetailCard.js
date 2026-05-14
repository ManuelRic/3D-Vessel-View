function getBoatInfoPanel() {
    return document.getElementById('boat-info-panel');
}

function renderBoatDetails(details) {
    return `
        <div class="boat-header">
            <img
                class="boat-flag"
                src="${details.flagImage}"
                alt="${details.flag} Flag"
            >

            <div class="boat-title">
                <h2>${details.name}</h2>

                <div class="boat-subtitle">
                    ${details.type} - IMO ${details.imo}
                </div>
            </div>
        </div>

        <div class="boat-section">
            <div class="boat-section-title">Voyage Data</div>

            <div class="boat-row">
                <div class="boat-label">Destination</div>
                <div class="boat-value">${details.destination}</div>
            </div>

            <div class="boat-row">
                <div class="boat-label">ETA</div>
                <div class="boat-value">${details.eta}</div>
            </div>

            <div class="boat-row">
                <div class="boat-label">Speed</div>
                <div class="boat-value">${details.speed}</div>
            </div>

            <div class="boat-row">
                <div class="boat-label">Course</div>
                <div class="boat-value">${details.course}</div>
            </div>

            <div class="boat-row">
                <div class="boat-label">Draught</div>
                <div class="boat-value">${details.draught}</div>
            </div>

            <div class="boat-row">
                <div class="boat-label">Navigation</div>
                <div class="status-badge">${details.status}</div>
            </div>
        </div>

        <div class="boat-section">
            <div class="boat-section-title">Ship Details</div>

            <div class="boat-row">
                <div class="boat-label">MMSI</div>
                <div class="boat-value">${details.mmsi}</div>
            </div>

            <div class="boat-row">
                <div class="boat-label">Callsign</div>
                <div class="boat-value">${details.callsign}</div>
            </div>

            <div class="boat-row">
                <div class="boat-label">Flag</div>
                <div class="boat-value">${details.flag}</div>
            </div>

            <div class="boat-row">
                <div class="boat-label">Length / Beam</div>
                <div class="boat-value">${details.lengthBeam}</div>
            </div>
        </div>
    `;
}

export function showBoatDetails(details) {
    const panel = getBoatInfoPanel();

    if (!panel) return;

    panel.innerHTML = renderBoatDetails(details);
    panel.classList.add('is-visible');
}

export function hideBoatDetails() {
    const panel = getBoatInfoPanel();

    if (!panel) return;

    panel.classList.remove('is-visible');
}
