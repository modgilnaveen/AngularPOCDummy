import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '../services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users : any[] = [];
    searchUser : any[] = [];
    userList: any[]= [];
    loggedUser: any;

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.loggedUser = localStorage.getItem('loggedUser');
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => {
                let borrowerList = users
                this.users = borrowerList.filter(x => x.loanAmount !== undefined);
                this.userList = this.users;
            }) ;
    }

    deleteUser(id: string) {
        const user: any = this.users.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.users = this.users && this.users.filter(x => x.id !== id) 
            });
    }

    onInput(e: any) {
        this.users = this.userList;
        this.searchUser = this.users && this.users.filter(x => x.firstName === e.target.value ||
            x.lastName === e.target.value);
            
        if(this.searchUser.length > 0 && e.target.value.trim() !== '') {
            this.users = this.searchUser;
        } else if (e.target.value.trim() !== '') {
            this.users = this.searchUser;
        } else {
            this.users = this.userList;
        } 
    }
}