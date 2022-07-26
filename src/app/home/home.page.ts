import { Component } from '@angular/core';
import * as ScanditSDK from 'scandit-sdk';
import { Barcode } from 'scandit-sdk';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {
    ScanditSDK.configure("YOUR_SCANDIT_LICENSE_KEY_IS_NEEDED_HERE", {
      engineLocation: "https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build/",
    })
      .then(() => {
        return ScanditSDK.BarcodePicker.create(document.getElementById("scandit-barcode-picker"), {
          scanningPaused: true,
          accessCamera: false,
          visible: false,
          playSoundOnScan: true,
          vibrateOnScan: true,
          scanSettings: new ScanditSDK.ScanSettings({ enabledSymbologies: [
            Barcode.Symbology.EAN8,
            Barcode.Symbology.EAN13,
            Barcode.Symbology.UPCA,
            Barcode.Symbology.UPCE
          ] }),
        });
      })
      .then((barcodePicker) => {
        // barcodePicker is ready here, show a message every time a barcode is scanned
        barcodePicker.on("scan", (scanResult) => {
          // We pause bacoderPicker when we get a result before changing the page. 
          barcodePicker.setVisible(false).pauseScanning(true);
          this.router.navigateByUrl(`/result/${scanResult.barcodes[0].data}`);
          
        });

        barcodePicker.accessCamera()
        .then(function () {
          barcodePicker.setVisible(true).resumeScanning();
        })
        .catch((error) => {
          if (error.message == "Permission denied") {
            alert("Camera access denied by user!");
          }
        });
      });
  }
  
  ionViewWillEnter() {
    // We re-activate barcodePicker when we enter the page again.
    barcodePicker.setVisible(true).resumeScanning(); 
  }
  
  

}
