import express from 'express';
import webPush from 'web-push';
import axios from 'axios';

const app = express();
const PORT = 3000;

// Configurar las claves VAPID
webPush.setVapidDetails(
    'mailto:yamidjhonatan@gmail.com',
    'BPDEYZBp_Qe_a5cWiFmxXlLgjQciJEyOBGXksenVCowDsGXvqJLlnwlIKDrQZKKOhAI5mt_pPLaRU8NSFhbsqH4',
    'LoHeZN2dKkOj_DWpcgA5sZYQdcTdjjm5aFsT4d6WEqg'
);

async function fetchAlertsAndSubscriptions() {
    try {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        };

        const response = await axios.get('https://hierbamala.vercel.app/api/sendNotifications', axiosConfig);
        // Ajusta la URL según tu configuración
        return response.data;
    } catch (error) {
        console.error('Error obteniendo alertas y suscripciones:', error);
        throw error;
    }
}

app.get('/send-notifications', async (req, res) => {
    try {
        const { alerts, subscriptions } = await fetchAlertsAndSubscriptions();

        if (!alerts.length) {
            return res.status(200).json({ success: false, message: 'No hay alertas para hoy' });
        }

        const results = [];

        for (const alert of alerts) {
            const notificationPayload = JSON.stringify({
                title: alert.title,
                body: alert.description,
            });

            for (const subscription of subscriptions) {
                try {
                    await webPush.sendNotification(
                        {
                            endpoint: subscription.endpoint,
                            keys: subscription.keys,
                        },
                        notificationPayload
                    );
                    results.push({ endpoint: subscription.endpoint, status: 'success', alertTitle: alert.title });
                } catch (error) {
                    console.error('Error enviando notificación:', error);

                    results.push({
                        endpoint: subscription.endpoint,
                        status: 'error',
                        message: error.message,
                        statusCode: error.statusCode,
                    });

                    // Opcional: manejar eliminación de suscripciones inválidas aquí si tienes acceso a la base de datos.
                }
            }
        }

        res.status(200).json({ success: true, message: 'Notificaciones enviadas', results });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error procesando las notificaciones', error });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo`);
});
