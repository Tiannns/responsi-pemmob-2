import { Component, OnInit, inject } from '@angular/core';
import { ModalController, RefresherCustomEvent } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { AuthenticationService } from '../services/authentication.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MessageComponent } from '../message/message.component';
import { DataService, Message } from '../services/data.service';
import { ApiService } from '../api.service';

const USERNAME = 'namasaya';
@Component({
 selector: 'app-homepage',
 templateUrl: './home.page.html',
 styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  dataKeuangan: any = [];
  id: number | null = null;
  nama: string = '';
  jenis: string = '';
  total: number = 0;
  deskripsi: string = '';
  modal_tambah: boolean = false;
  modal_edit: boolean = false;
  private data = inject(DataService);
  
  constructor(
    private authService: AuthenticationService, 
    private alertController :AlertController,
    private router : Router,
    private _apiService : ApiService,
    private modal: ModalController

    ) { }
    ngOnInit() {
        this.cekSesi();
        this.getKeuangan();
        console.log(this.nama);
    }

    getKeuangan() {
      this._apiService.tampil('tampilKeuangan.php').subscribe({
        next: (res: any) => {
          console.log('sukses', res);
          this.dataKeuangan = res;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    }

    reset_model(){
      this.id = null;
      this.jenis = '';
      this.total = 0 ;
      this.deskripsi = '';
    }

    cancel() {
      this.modal.dismiss();
      this.modal_tambah = false;
      this.reset_model();
    }

    open_modal_tambah(isOpen: boolean) {
      this.modal_tambah = isOpen;
      this.reset_model();
      this.modal_tambah = true;
      this.modal_edit = false;
    }

    open_modal_edit(isOpen: boolean, idget: any) {
      this.modal_edit = isOpen;
      this.id = idget;
      console.log(this.id);
      this.ambilKeuangan(this.id);
      this.modal_tambah = false;
      this.modal_edit = true;
    }

    tambahKeuangan() {
      if (this.deskripsi != '' && this.total != 0 && this.jenis != '') {
        let data = {
          jenis: this.jenis,
          deskripsi: this.deskripsi,
          total: this.total,
        };
        this._apiService.tambah(data, '/tambahKeuangan.php').subscribe({
          next: (hasil: any) => {
            this.reset_model();
            console.log('berhasil tambah Transaksi');
            this.getKeuangan();
            this.modal_tambah = false;
            this.modal.dismiss();
          },
          error: (err: any) => {
            console.log('gagal tambah Transaksi');
          },
        });
      } else {
        console.log('gagal tambah Transaksi karena masih ada data yg kosong');
      }
    }

    hapusKeuangan(id: any) {
      this._apiService.hapus(id, '/hapusKeuangan.php?id=').subscribe({
        next: (res: any) => {
          console.log('sukses', res);
          this.getKeuangan();
          console.log('berhasil hapus data');
        },
        error: (error: any) => {
          console.log('gagal');
        },
      });
    }

    ambilKeuangan(id: any) {
      this._apiService.lihat(id, '/lihatKeuangan.php?id=').subscribe({
        next: (hasil: any) => {
          console.log('sukses', hasil);
          let keuangan = hasil;
          this.id = keuangan.id;
          this.jenis = keuangan.jenis;
          this.total = keuangan.total;
          this.deskripsi = keuangan.deskripsi;
        },
        error: (error: any) => {
          console.log('gagal ambil data');
        },
      });
    }

    editKeuangan() {
      let data = {
        id: this.id,
        jenis: this.jenis,
        total: this.total,
        deskripsi: this.deskripsi,
      };
      this._apiService.edit(data, '/editKeuangan.php').subscribe({
        next: (hasil: any) => {
          console.log(hasil);
          this.reset_model();
          this.getKeuangan();
          console.log('berhasil edit Keuangan');
          this.modal_edit = false;
          this.modal.dismiss();
        },
        error: (err: any) => {
          console.log('gagal edit Keuangan');
        },
      });
    }

    async cekSesi() {
      const ambilNama = localStorage.getItem(USERNAME);
      if (ambilNama) {
        let namauser = ambilNama;
        this.nama = namauser;
      } else {
        this.authService.logout();
        this.router.navigateByUrl('/', { replaceUrl: true });
      }
    }
    refresh(ev: any) {
      setTimeout(() => {
        (ev as RefresherCustomEvent).detail.complete();
      }, 3000);
    }
    getMessages(): Message[] {
      return this.data.getMessages();
    }
 logout() {
  this.alertController.create({
  header: 'Perhatian',
  subHeader: 'Yakin Logout aplikasi ?',
  buttons: [
  {
  text: 'Batal',
  handler: (data: any) => {
  console.log('Canceled', data);
  }
  },
  {
  text: 'Yakin',
  handler: (data: any) => {
  //jika tekan yakin
  this.authService.logout();
  this.router.navigateByUrl('/', { replaceUrl: true });
  }
  }
  ]
  }).then(res => {
  res.present();
  });
  }
 }