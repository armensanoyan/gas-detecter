import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, Platform, ActionSheetController, Content } from 'ionic-angular';
// import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AboutPage } from '../about/about'
import { ConnectionProvider } from '../../providers/connection/connection';


import { ChartsModule } from 'ng2-charts';
import { LIFECYCLE_HOOKS_VALUES } from '@angular/compiler/src/lifecycle_reflector';


@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class HomePage {
    @ViewChild(Content) content: Content;
    concentration = ''
    // devices = []
    // device = 0
    connectToBluetooth
    constructor(
        public connectionProvider: ConnectionProvider,
        public navCtrl: NavController, 
        // public bluetoothSerial: BluetoothSerial, 
        public platform: Platform,
        public ngZone: NgZone,
        public actionSheetCtrl: ActionSheetController,
        public ChartsModule: ChartsModule,
    ) {}

    ngOnInit() {
        
    }

    onClickOpenList() {

        const listOfDevices = this.connectionProvider.listOfDevices()

        listOfDevices.then( devices => {
            this.displayList(devices)
        }, failure => {
            console.log('listOfDevices failed ', failure);
        })
        

    }

    write() {
        this.connectionProvider.write()
    }

    displayList(devices) {
        const buttons = []
        
        if(typeof devices == 'object') {
            
            devices.forEach(element => {
                
                const button = {
                    text: element.name,
                    role: 'destructive',
                    handler: () => {
                        const connectingToDevice = this.connectionProvider.onDevicesClick(element.id)

                        connectingToDevice.subscribe((success) => {
                            this.ngZone.run(() => {
                                this.connectToBluetooth = 'the connection is established'
                                const result = this.connectionProvider.subscribeForData()
                                this.resivrDate(result)
                            })
            
                        }, (failure) => {
                            console.log('failt to connect', failure)
                            this.ngZone.run(() => {
                                this.connectToBluetooth = `sorry couldn't connect to device`
                            })
                        })
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

    resivrDate(subscribeForData) {
        subscribeForData.subscribe(success => {
            this.concentration = success

            console.log('subscribeForData', this.concentration);

            this.connectionProvider.write(success)

            // const write = this.bluetoothSerial.write(success).then((success) => {

            // }, failure => {
            //     console.log('failt to write', failure);
            // });

        }, failure => {
            console.log('subscribeForData failure', failure);
        })
    }

    }
