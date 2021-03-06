import {Component, OnInit} from '@angular/core';
import {ViewChild, ViewEncapsulation} from '@angular/core';
import {MdSidenav} from '@angular/material';
import {Observable} from 'rxjs/Rx' ;
import {GithubService} from '../../core/github.service';
import {MdDialog} from '@angular/material';
import {SettingsComponent} from './settings/settings.component';

@Component({
    selector: 'app-shell',
    templateUrl: './shell.component.html',
    styleUrls: ['./shell.component.scss']
    // encapsulation: ViewEncapsulation.None
})

export class ShellComponent implements OnInit {

    @ViewChild('sidenav') sidenav: MdSidenav;
    navIsVisible: boolean;

    mainLinks: Array<Object> = [
        {
            name: 'Home',
            icon: 'home',
            path: '/home'
        },
        {
            name: 'Issues',
            icon: 'bug_report',
            path: '/issues'
        }
    ];

    subLinks: Array<Object> = [
        {
            name: 'Settings',
            icon: 'settings',
        },
        {
            name: 'Open in Github',
            icon: 'code'
        }
    ];

    repoName: string;

    constructor(private githubService: GithubService,
                public dialog: MdDialog) {
    }

    ngOnInit() {

        // Observable.from(this.githubService.repoName)
        //     .subscribe(title => this.repoName = title);

        Observable.fromEvent(window, 'resize')
        // .debounceTime(100)
            .subscribe((event) => {
                this.checkNav(event);
            });
        if (window.innerWidth > 1490) {
            this.navIsVisible = true;
        }
        Observable
            .combineLatest([
                this.githubService.useRealData$,
                this.githubService.repoName$
            ])
            .subscribe(([useRealData, repoName]) => {
                this.repoName = useRealData ? repoName : 'angular/material2 (mock)'
            }, err => {
                console.log(err);
            });

    }

    openDialog() {
        let dialogRef = this.dialog.open(SettingsComponent);
        dialogRef.afterClosed().subscribe(input => {
            // console.log(input);
            if (input) {
                this.githubService.publishRepo(input.value);
                this.githubService.toggleDataStatus(input.enabled);
            }
        });
    }

    private checkNav(e: any) {
        if (e.target.innerWidth > 1490) {
            this.navIsVisible = true;
            return;
        }
        this.navIsVisible = false;
    }

}
