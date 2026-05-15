export function initDateTimeWidget(){
    const dateTimeWidget = document.getElementById('datetime-widget');

    const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    function updateDateTimeWidget() {
        if (!dateTimeWidget) return;

        dateTimeWidget.textContent = dateTimeFormatter.format(new Date());
    }

    updateDateTimeWidget();
    setInterval(updateDateTimeWidget, 1000);
}