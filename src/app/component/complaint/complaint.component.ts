import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ComplaintService } from '../../providers/complaint.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
declare let $: any;

@Component({
  selector: 'complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})
export class ComplaintComponent implements OnInit, AfterViewInit {

  public editForm: FormGroup;
  public closeForm: FormGroup;
  public complaints: any;
  public employees: any;
  public priorities: any;
  public comments: any;
  public commentForm: FormGroup;
  public EmptyComments: boolean = false;
  public complaintStatus: any;
  public complaintCategory: any;
  public complaintsCOPY: any;
  public EmptyComplaints: boolean = false;
  public loader: boolean = false;
  public loader1: boolean = false;
  public currentPage = 1;
  public emptySearchResult: boolean = false;
  public complaint = {
    title: ""
  }
  public fileUrl: string;

  public url: string = "";
  public status: string = "";
  public count: any = 0;
  constructor(public cs: ComplaintService,
    public router: Router,
    public route: ActivatedRoute, ) {
    this.url = this.router.url;
    this.route.params.subscribe(param => {
      if (param['statusId']) this.complaintStatus = param['statusId'];
      if (param['categoryId']) this.complaintCategory = param['categoryId'];
    });
    switch (this.complaintStatus) {
      case '1': this.status = "New"; break;
      case '2': this.status = "Assigned"; break;
      case '3': this.status = "InProgress"; break;
      case '4': this.status = "Closed"; break;
      case '5': this.status = "Reopen"; break;
      case '6': this.status = "Satisfied"; break;
      default: this.status = "All"; break;
    }
  }

  ngOnInit() {
    this.fileUrl = localStorage.getItem("fileUrl") + "/";
    this.fetchComplaints();
    this.getEditInfo();
    this.loadForm();
    this.commentForm = new FormGroup({
      comment: new FormControl("")
    });
    this.closeForm = new FormGroup({
      rca: new FormControl("", [Validators.required]),
      comment: new FormControl("", [Validators.required])
    })
  }

  public getEditInfo() {
    this.cs.editInfo().subscribe(response => {
      this.employees = response.employees;
      this.priorities = response.priorities;
    },
      error => {
        this.employees = [];
        this.priorities = [];
        this.router.navigate(['/error']);
      })
  }

  ngAfterViewInit() {
    $('.panel.panel-chat').hide();
    $(".panel.panel-chat > .panel-heading > .chatMinimize").click(function () {
      if ($(this).parent().parent().hasClass('mini')) {
        $(this).parent().parent().removeClass('mini').addClass('normal');

        $('.panel.panel-chat > .panel-body').animate({ height: "250px" }, 500).show();

        $('.panel.panel-chat > .panel-footer').animate({ height: "75px" }, 500).show();
      }
      else {
        $(this).parent().parent().removeClass('normal').addClass('mini');

        $('.panel.panel-chat > .panel-body').animate({ height: "0" }, 500);

        $('.panel.panel-chat > .panel-footer').animate({ height: "0" }, 500);

        setTimeout(function () {
          $('.panel.panel-chat > .panel-body').hide();
          $('.panel.panel-chat > .panel-footer').hide();
        }, 500);
      }

    });
    $(".panel.panel-chat > .panel-heading > .chatClose").click(function () {
      // $(this).parent().parent().remove();
      $(this).parent().parent().hide();
    });
  }

  public fetchComplaints() {
    this.loader = true;
    this.cs.getComplaint(this.url, this.currentPage).subscribe((res) => {

      this.onSuccess(res);
    }, (err) => {
      this.onError(err);
    });
  }
  public noMore: boolean = false;

  public onSuccess(res: any) {
    this.loader = false;
    if (res.status !== 204) {
      this.complaints = res;
      if (this.complaints.length < 10) this.noMore = true;
      else this.noMore = false;
      this.complaintsCOPY = res;
      this.EmptyComplaints = false;
    } else {
      this.EmptyComplaints = true;
    }
  }

  public onError(err: any) {
    this.complaints = [];
    this.router.navigate(['/error']);
  }

  public selectedComplaint: any;
  public selectedIndex: any;

  public selectComplaint(complaint: any, index: any) {
    this.selectedComplaint = complaint;
    this.selectedIndex = index;
    this.loadFormValue();

  }

  public seletToExpand(c: any, i: any) {
    this.selectedComplaint = c;
    this.selectedIndex = i;
    this.cs.getComplaintCommentById(this.url, c.id).subscribe((res) => {
      if (res.status === 204) {
        this.EmptyComments = true;
        this.comments = [];
        this.count = 0;
        return;
      }
      this.EmptyComments = false;
      this.comments = res;
      this.count = this.comments.length;
    }, (err) => {
      delete this.comments;
      this.router.navigate(['/error']);
    });
  }

  public updateComplaint() {
    if (this.editForm.value['statusId'])
      this.editForm.value['statusId'] = 3;
    else {
      this.loader1 = true;
      delete this.editForm.value['statusId'];
    }
    // if(this.editForm.value['assignedTo'] == this.selectedComplaint.assignedEmployeeId)
    //   delete this.editForm.value['assignedTo'];
    // if(this.editForm.value['priorityId'] == this.selectedComplaint.priorityId)
    //   delete this.editForm.value['priorityId'];
    this.cs.updateComplaint(this.selectedComplaint.id, this.editForm.value, this.url).subscribe(response => {
      this.complaints[this.selectedIndex] = response;

      this.loader1 = false;
      $('#myModal').modal('hide');
    }, error => {
      this.loader = false;
      this.router.navigate(['/error']);
    });
    console.log("updated", this.complaints);
  }

  public loadForm() {
    this.editForm = new FormGroup({
      assignedTo: new FormControl(''),
      priorityId: new FormControl(''),
      statusId: new FormControl('')
    })
  }

  public loadFormValue() {
    console.log("c", this.selectedComplaint);
    console.log("c", this.selectedIndex);
    this.editForm.patchValue({ "assignedTo": this.selectedComplaint.assignedEmployeeId });
    this.editForm.patchValue({ "priorityId": this.selectedComplaint.priorityId });
  }

  public closeComplaint() {
    this.loader1 = true;
    this.cs.closeComplaint(this.selectedComplaint.id, this.closeForm.value, this.url).subscribe(response => {
      this.complaints[this.selectedIndex] = response;
      $('#myModal3').modal('hide');
    }, error => {
      this.router.navigate(['/error']);
    });
    this.loader1 = false;
  }



  public previousComplaint() {
    delete this.complaints;
    this.currentPage -= 1;
    this.fetchComplaints();
  }

  public nextComplaint() {
    delete this.complaints;
    this.currentPage += 1;
    this.fetchComplaints();
  }

  public loadComplaints() {
    this.complaints = this.complaintsCOPY;
  }

  public resetComplaints() {
    this.loadFormValue();
  }

  // public searchComplaints(ev: any) {
  //   let val: any = ev.target.value;
  //   if (val && val.trim() != '') {
  //     this.loader = true;
  //     this.emptySearchResult = false;

  //     this.cs.searchComplaints(this.currentPage, { "search": val }).subscribe((res: any) => {
  //       if (res.status == 204) {
  //         this.complaints = [];
  //         this.loader = false;
  //         this.emptySearchResult = true;
  //         return;
  //       }
  //       this.loader = false;
  //        console.log('res')
  //     },
  //       (error: any) => {
  //         this.loader = false;
  //         console.log("err",error);
  //       })
  //   }
  //   else {
  //     this.emptySearchResult = false;
  //     this.complaints = this.complaintsCOPY;
  //   }

  // }

  public complaintIdOfCommentModel: any;
  public complaintTitleOfCommentModel: any;
  public closedOn: boolean = false;
  currentUser = this.cs.getUserId();

  getComplaintCommentById(complaint: any) {
    if (complaint == undefined) {
      this.cs.getComplaintCommentById(this.url, this.selectedComplaint.id).subscribe((res) => {
        if (res.status === 204) {
          this.EmptyComments = true;
          this.comments = [];
          this.count = 0;
          return;
        }
        this.EmptyComments = false;
        this.comments = res;
        this.count = this.comments.length;
      }, (err) => {
        delete this.comments;
        this.router.navigate(['/error']);
      });
      if (this.selectedComplaint.closedOn || this.selectedComplaint.statusId == 6) this.closedOn = true;
      this.complaintIdOfCommentModel = this.selectedComplaint.id;

      this.complaints.forEach((element: any) => {
        if (element['id'] == this.selectedComplaint.id)
          this.complaintTitleOfCommentModel = element.title;
      });


    }
    else {

      this.cs.getComplaintCommentById(this.url, complaint.id).subscribe((res) => {
        if (res.status === 204) {
          this.EmptyComments = true;
          this.comments = [];
          this.count = 0;
          return;
        }
        this.EmptyComments = false;
        this.comments = res;
        console.log("comments",res);
        this.count = this.comments.length;
      }, (err) => {
        delete this.comments;
        this.router.navigate(['/error']);
      });
      if (complaint.closedOn || complaint.statusId == 6)
      { this.closedOn = true; }
      else { this.closedOn = false; }
      this.complaintIdOfCommentModel = complaint.id;

      this.complaints.forEach((element: any) => {
        if (element['id'] == complaint.id)
          this.complaintTitleOfCommentModel = element.title;
      });

    }
  }

  public submitComment() {
    this.EmptyComments = false;
    if (this.commentForm.value['comment'])
      this.cs.postComplaintComment(this.complaintIdOfCommentModel, this.commentForm.value, this.url).subscribe((res) => {
        this.commentForm.value['employeeId'] = this.currentUser;
        this.commentForm.value['createdAt'] = new Date();
        this.comments.push(this.commentForm.value);

        this.commentForm.reset();
      }, (err) => {
        this.router.navigate(['/error']);
      });
  }

  public clearComment() {
    delete this.comments;
  }

  public openModal(complaint: any) {
    this.complaint = complaint;
    $('#modal1').modal('show');
  }
}