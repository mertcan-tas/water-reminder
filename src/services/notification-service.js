import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';

async function sendTauriNotification(title, body) {
  try {
    let permissionGranted = await isPermissionGranted();
    //console.log("İzin durumu:", permissionGranted);
    
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === "granted";
      //console.log("İzin sonucu:", permission);
    }
    
    if (permissionGranted) {
      await sendNotification({
        title: title,
        body: body,
        sound: null,
      });
      
      //console.log("Bildirim gönderildi");
      return true;
    } else {
      //console.warn("Bildirim izni reddedildi");
      return false;
    }
  } catch (error) {
    //console.error("Bildirim hatası:", error);
    return false;
  }
}

export default sendTauriNotification;
