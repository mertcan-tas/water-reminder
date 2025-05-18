import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";

async function sendTauriNotification(title, body) {
  try {
    let permissionGranted = await isPermissionGranted();
    
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === "granted";
    }
    
    if (permissionGranted) {
      await sendNotification({
        title: title,
        body: body,
        sound: null,
      });

      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

export default sendTauriNotification;
