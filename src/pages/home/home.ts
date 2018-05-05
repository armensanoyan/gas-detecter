import { Component, NgZone } from '@angular/core';
import { NavController, Platform, ActionSheetController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AboutPage } from '../about/about'

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class HomePage {

    devices = []
    device = 0
    text = []
    times = 0
    connectToBluetooth

    constructor(
        public navCtrl: NavController, 
        public bluetoothSerial: BluetoothSerial, 
        public platform: Platform,
        public ngZone: NgZone,
        public actionSheetCtrl: ActionSheetController
    ) {}

    ngOnInit() {
        this.platform.ready().then(()=> {
            const pairedDevices = this.bluetoothSerial.list() 

            pairedDevices.then( devices => {
                this.devices = devices
                console.log(devices)
            }, failure => {
                console.log('failure for devise listener', failure);
            } )
            
            const newDevices = this.bluetoothSerial.discoverUnpaired()
            console.log('newDevices-->', newDevices);

            const setDeviceDiscoveredListener = this.bluetoothSerial.setDeviceDiscoveredListener()
            setDeviceDiscoveredListener.subscribe(success => {
                console.log('success for listening devices', success);

            }, failure => {
                console.log('failure for devise listener', failure);
            })

            

            const subscribeForData = this.bluetoothSerial.subscribe('\n');
            subscribeForData.subscribe(success => {
                this.ngZone.run(() => {
                    this.text.push(success)
                })
                console.log('subscribeForData', success);
                console.log('this.text', this.text);

            }, failure => {
                console.log('subscribeForData', failure);
            })

            const write = this.bluetoothSerial.write('hello world').then((success) => {
                    console.log('success in writing', success);
                }, failure => {
                    console.log('failt to write',failure);

                });

                const readData = this.bluetoothSerial.read();
                readData.then(data => {
                    console.log('readData',data)
                }, failure => {
                    console.log('failure', failure);
            
         })
        })
    }

    onClickOpenList() {

        const buttons = []
        const devices = this.devices

        console.log(this.devices);
        
        if(typeof this.devices == 'object') {


            devices.forEach(element => {

            const button = {
                text: element.name,
                role: 'destructive',
                handler: () => {
                    this.onDevicesClick(element.id)
                }
            }

            buttons.push(button)
        });

        buttons.push(
            {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }}
        )

        let actionSheet = this.actionSheetCtrl.create({
            title: 'Devices',
            buttons: buttons
          });
       
          actionSheet.present();
        }
    }

    onDevicesClick(id) {
        
            this.platform.ready().then(() => {
                const connection = this.bluetoothSerial.connectInsecure(id)
                .subscribe((success) => {
                    console.log('succesfully connected', success);
                    this.ngZone.run(() => {
                        this.connectToBluetooth = 'the connection is established'
                    })
                    console.log('connectToBluetooth', this.connectToBluetooth);
    
    
                }, (failure) => {
                    console.log('failt to connect', failure)
                    this.ngZone.run(() => {
                        this.connectToBluetooth = `sorry couldn't connect to device ${this.times}`
                    })
                    console.log('connectToBluetooth', this.connectToBluetooth);
                })
            })
    }

    write() {
        this.platform.ready().then(() => {
            const write = this.bluetoothSerial.write('hello world \n').then((success) => {
                console.log('success in writing', success);
            }, failure => {
                console.log('failt to write', failure);

            });
        })
    }

}
