import { Injectable, NgZone } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Platform } from 'ionic-angular';

@Injectable()
export class ConnectionProvider {

    concentration = ''
    devices = []
    connectToBluetooth

    constructor(
        public bluetoothSerial: BluetoothSerial,
        public platform: Platform,
        public ngZone: NgZone
    ) {}

    listOfDevices () {
        const pairedDevices = this.bluetoothSerial.list() 
        return pairedDevices
    }


    // subscribeForData() {
    //     const subscribeForData =this.bluetoothSerial.subscribe('\n')
    //     return subscribeForData
    // }

    subscribeForRowData() {
        const subscribeForData =this.bluetoothSerial.subscribeRawData()
        return subscribeForData
    }

    fromBufferToString() {
        const getStrings = this.bluetoothSerial.read()
        return getStrings
    }

    onDevicesClick(id) {
        const connection = this.bluetoothSerial.connectInsecure(id)
        return connection
    }

    write(answear='default') {
        this.platform.ready().then(() => {
            const write = this.bluetoothSerial.write(answear + '\n').then((success) => {
            }, failure => {
                console.log('failt to write', failure);
            });
        })
    }

}
