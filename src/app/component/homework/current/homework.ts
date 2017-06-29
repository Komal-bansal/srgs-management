import { Component, OnInit } from '@angular/core';
// import { HomeworkAddComponent } from '../add/add';
import { HomeworkService } from '../../../providers/homework.service';
// import { CustomService } from '../../../providers/custom.service';

@Component({
  selector: 'current-homework',
  templateUrl: './homework.html',
  styleUrls:['./../homework.component.css']
})

export class CurrentHomework implements OnInit {
  public selectedHomework:any;
  public fileUrl : string;
  public title: string = "Homework";
  public icon: string = "book";
  public currentPage = 1;
  public homeworks:any = [];
  loader:boolean = false;
  public EmptyHomeworks: boolean = false;
  monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];


  constructor(private homeworkService: HomeworkService) { }

  ngOnInit(): void {
    this.fileUrl = localStorage.getItem("fileUrl") + "/";
    this.getHomeworks();
  }

  public getHomeworks() {
    // this.nl.showLoader();
    this.loader = true;
    this.homeworkService.getHomework(this.currentPage).subscribe((data) => {
      console.log(data);
      this.onSuccess(data);
    }, (err) => {
      // this.nl.hideLoader();
    });
  }

  public noMore:boolean = false;
  public onSuccess(res:any) {
    // this.nl.hideLoader();
    this.loader = false;
    if (res.status === 204) {
      this.EmptyHomeworks = true;
    } else {
      this.EmptyHomeworks = false;
      this.homeworks = res;
      if(this.homeworks.length < 10) this.noMore = true;
      else this.noMore = false;
      this.homeworks.forEach((data:any) => {
        data.dueMonth = this.monthNames[(new Date(data.dueDate)).getMonth()];
        data.dueDate = ("0" + (new Date(data.dueDate).getDate())).slice(-2);
      });
    }
  }

  public onError(err:any) {
    // this.nl.onError(err);
  }

  public previousHomework() {
    delete this.homeworks;
    this.currentPage -= 1;
    this.getHomeworks();
  }

  public nextHomework() {
    delete this.homeworks;
    this.currentPage += 1;
    this.getHomeworks();
  }

 public seletToExpand(a:any){
    this.selectedHomework = a;
  }

  // public doInfinite(infiniteScroll) {
  //   this.currentPage += 1;
  //   setTimeout(() => {
  //     this.homeworkService.getHomework(this.currentPage).subscribe((response) => {
  //       if (response.status === 204) {
  //         this.currentPage -= 1;
  //         infiniteScroll.complete();
  //         return;
  //       }
  //       let newHomework = response;
  //       newHomework.forEach((data) => {
  //         data.dueMonth = this.monthNames[(new Date(data.dueDate)).getMonth()];
  //         data.dueDate = ("0" + (new Date(data.dueDate).getDate())).slice(-2);
  //       });
  //       this.homeworks = this.homeworks.concat(newHomework);
  //       infiniteScroll.complete();
  //     }, (err) => {
  //       this.currentPage -= 1;
  //       infiniteScroll.complete();
  //     });
  //   }, 1000);
  // }

  // public addHomework() {
  //   let homeworkModal = this.modalCtrl.create(HomeworkAddComponent);
  //   homeworkModal.onDidDismiss((newHomewok) => {
  //     if (!newHomewok) { return; }
  //     if (!this.homeworks) { this.homeworks = []; }
  //     this.EmptyHomeworks = false;
  //     newHomewok.dueMonth = this.monthNames[(new Date(newHomewok.dueDate)).getMonth()];
  //     newHomewok.dueDate = ("0" + (new Date(newHomewok.dueDate).getDate())).slice(-2);
  //     this.homeworks.unshift(newHomewok);
  //   });
  //   homeworkModal.present();
  // }

  // public doRefresh(refresher) {
  //   setTimeout(() => {
  //     this.homeworkService.getHomework(1).subscribe((res) => {
  //       this.onSuccess(res);
  //       refresher.complete();
  //     }, (err) => {
  //       refresher.complete();
  //       this.onError(err);
  //     });
  //   }, 500);
  // }

}
