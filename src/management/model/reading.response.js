export class ReadingResponse {
  constructor({localId, sensorTypeId, message, timestamp}) {
    this.localId = localId;
    this.sensorTypeId = sensorTypeId;
    this.message = message;
    this.timestamp = this.formatTimestamp(timestamp);
  }

  formatTimestamp(timestamp) {
    if (!timestamp) {
      // Si no hay timestamp, usar fecha actual en formato ISO
      timestamp = new Date().toISOString();
    }

    // Convertir a Date si es necesario
    const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);

    // Formatear de forma consistente: dd/MM/yyyy HH:mm
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
}