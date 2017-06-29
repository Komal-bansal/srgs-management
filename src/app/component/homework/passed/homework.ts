import { Component, OnInit } from '@angular/core';
import { HomeworkService } from '../../../providers/homework.service';
// import { CustomService } from '../../../providers/custom.service';

@Component({
  selector: 'passed-homework',
  styleUrls:['./../homework.component.css'],
  templateUrl: './homework.html'
})

export class PassedHomework implements OnInit {

  public fileUrl : string;
  public title: string = 'Homework';
  public icon: string = "book";
  public EmptyHomeworks = false;
  public homeworks:any = [];
  currentPage = 1;
  loader:boolean = false;
  monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  public selectedHomework:any;

  constructor(private homeworkService: HomeworkService,
              // private nl: CustomService
              ) {
  }

  ngOnInit() : void {
    this.fileUrl = localStorage.getItem("fileUrl") + "/";
    this.getHomeworks();
  }

  public getHomeworks() {
    // this.nl.showLoader();
    this.loader = true;
    this.homeworkService.getOldHomework(this.currentPage).subscribe((data) => {
      console.log(data);
      this.onSuccess(data);
    }, (err) => {
      // this.nl.hideLoader();
    });
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

  public doRefresh(refresher:any) {
    setTimeout(() => {
      this.homeworkService.getOldHomework(1).subscribe((res) => {
        this.onSuccess(res);
        refresher.complete();
      }, (err) => {
        refresher.complete();
        this.onError(err);
      });
    }, 500);
  }
  noMore:boolean = false;
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

  public doInfinite(infiniteScroll:any) {
    this.currentPage += 1;
    setTimeout(() => {
      this.loadMoreData(infiniteScroll);
    }, 500);
  }

  public loadMoreData(infiniteScroll:any) {
    this.homeworkService.getOldHomework(this.currentPage).subscribe((res) => {
      infiniteScroll.complete();
      this.loadDataSuccess(res);
    }, (err) => {
      infiniteScroll.complete();
      this.loadDataError(err);
    });
  }

  public loadDataSuccess(res:any) {
    if (res.status === 204) {
      this.currentPage -= 1;
      return;
    }
    let newHomework = res;
    newHomework.forEach((data:any) => {
      data.dueMonth = this.monthNames[(new Date(data.dueDate)).getMonth()];
      data.dueDate = ("0" + (new Date(data.dueDate).getDate())).slice(-2);
    });
    this.homeworks = this.homeworks.concat(newHomework);
  }

  public loadDataError(err:any) {
    this.currentPage -= 1;
    // this.nl.onError(err);
  }

   public seletToExpand(a:any){
    this.selectedHomework = a;
  }


}
