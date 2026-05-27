// Cargar reportes cuando la página está lista
document.addEventListener('DOMContentLoaded', () => {
    const user = window.firebaseAuth.auth.currentUser;

    if (user) {
        cargarReportes(user.uid);
    } else {
        // Si el usuario no está autenticado, redirigir a login
        window.firebaseAuth.onAuthStateChanged(window.firebaseAuth.auth, (currentUser) => {
            if (currentUser) {
                cargarReportes(currentUser.uid);
            } else {
                window.location.href = 'login.html';
            }
        });
    }
});

async function cargarReportes(userId) {
    const loadingContainer = document.getElementById('loadingContainer');
    const emptyContainer = document.getElementById('emptyContainer');
    const tableContainer = document.getElementById('tableContainer');
    const reportesBody = document.getElementById('reportesBody');

    try {
        const { collection, query, where, orderBy, getDocs } = window.firebaseAuth;
        const { db } = window.firebaseAuth;

        // Consultar todos los reportes del usuario.
        // Ordenamos localmente para evitar la necesidad de un índice compuesto en Firestore.
        const q = query(
            collection(db, "reportes"),
            where("userId", "==", userId)
        );

        const querySnapshot = await getDocs(q);

        loadingContainer.style.display = 'none';

        if (querySnapshot.empty) {
            emptyContainer.style.display = 'block';
            return;
        }

        const reportes = [];
        querySnapshot.forEach((doc) => {
            reportes.push(doc.data());
        });

        reportes.sort((a, b) => {
            const getTime = (timestamp) => {
                if (!timestamp) return 0;
                if (typeof timestamp.toMillis === 'function') {
                    return timestamp.toMillis();
                }
                if (typeof timestamp === 'string') {
                    return new Date(timestamp).getTime();
                }
                return Number(timestamp) || 0;
            };
            return getTime(b.timestamp) - getTime(a.timestamp);
        });

        tableContainer.style.display = 'block';
        reportesBody.innerHTML = '';

        reportes.forEach((reporte) => {
            const fecha = new Date(
                reporte.timestamp && typeof reporte.timestamp.toMillis === 'function'
                    ? reporte.timestamp.toMillis()
                    : reporte.timestamp
            );
            const fechaFormato = fecha.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const locationText = reporte.manualAddress
                || reporte.address
                || reporte.location?.address
                || 'No disponible';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <span class="type-badge">${reporte.type}</span>
                </td>
                <td>
                    <div class="description-text">${reporte.description}</div>
                </td>
                <td>
                    <div class="location-text">${locationText}</div>
                </td>
                <td>
                    <div class="timestamp-text">${fechaFormato}</div>
                </td>
                <td>
                    <span class="status-badge status-${reporte.status.toLowerCase().replace(' ', '-')}">${reporte.status}</span>
                </td>
            `;
            reportesBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error al cargar reportes:", error);
        loadingContainer.style.display = 'none';
        emptyContainer.style.display = 'block';
        emptyContainer.innerHTML = `
            <div class="empty-state-icon">⚠️</div>
            <h3>Error al cargar reportes</h3>
            <p>Intenta recargar la página</p>
        `;
    }
}
