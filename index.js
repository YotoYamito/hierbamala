import express from 'express'; // Usamos import para Express
import webPush from 'web-push'; // Usamos import para web-push

const app = express(); // Crear una instancia de la aplicación
const PORT = 3000;

// Configurar las claves VAPID
webPush.setVapidDetails(
  'mailto:yamidjhonatan@gmail.com',
  'BPDEYZBp_Qe_a5cWiFmxXlLgjQciJEyOBGXksenVCowDsGXvqJLlnwlIKDrQZKKOhAI5mt_pPLaRU8NSFhbsqH4',
  'LoHeZN2dKkOj_DWpcgA5sZYQdcTdjjm5aFsT4d6WEqg'
);

// Ruta principal
app.get('/', async (req, res) => {
  const pushSubscription = {
    endpoint: 'https://fcm.googleapis.com/fcm/send/cDVpb0-IhMQ:APA91bEi5Z8kLbPbFOgvmQf-otmLKbEND8DP4KM3XirMxEXI-XqEpk6Rbfk9ifoff_xdHWCEsWMMyIhFG9dsg7nzzET0cTciO1zLqLII4Xnp1YubmqSjdUz6jc-kGSfCpUtRKGrg74Yc',
    keys: {
      auth: 'PUo9lzuX2XcM45lhqPAG1Q',
      p256dh: 'BMpkUPWSnAtHz1XpZuJ6KZWezzM6G7o5PYaQ2NfZ2CqgfT7NPLGASEJXmqrQSDascTZnieoxnadzMHW8XA8PkAo'
    }
  };

  const notificationPayload = JSON.stringify({
    title: 'test2024',
    body: 'funciona',
  });

  try {
    await webPush.sendNotification(pushSubscription, notificationPayload);
    res.json({ success: true, message: 'Notificación enviada exitosamente' });
  } catch (error) {
    console.error('Error enviando la notificación:', error);
    res.status(500).json({ success: false, message: 'Error enviando la notificación', error });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
