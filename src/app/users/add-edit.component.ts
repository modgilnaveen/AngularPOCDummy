import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form !: FormGroup;
    id: string | undefined;
    isAddMode: boolean | undefined;
    loading = false;
    submitted = false;
    loggedUser: any;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.loggedUser = localStorage.getItem('loggedUser');
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            loanType: ['', Validators.required],
            loanNumber: ['', Validators.required],
            loanAmount: ['', Validators.required],
            loanTerm: ['', Validators.required],
            loanPropertyAddress: ['', Validators.required]
        });

        if (!this.isAddMode) {
            if(this.id)
            this.accountService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.f['firstName'].setValue(x.firstName);
                    this.f['lastName'].setValue(x.lastName);
                    this.f['loanType'].setValue(x.loanType);
                    this.f['loanNumber'].setValue(x.loanNumber);
                    this.f['loanAmount'].setValue(x.loanAmount);
                    this.f['loanTerm'].setValue(x.loanTerm);
                    this.f['loanPropertyAddress'].setValue(x.loanPropertyAddress);
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this?.form?.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createUser();
        } else {
            this.updateUser();
        }
    }

    private createUser() {
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Borrower added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private updateUser() {
        this.accountService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['..', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}