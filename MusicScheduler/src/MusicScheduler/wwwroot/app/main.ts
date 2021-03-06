﻿import { YoutubeFile, User, Info } from "./core/classes";

import {Component} from "angular2/core";
import {Injectable} from "angular2/core";
import {Http, Response, Headers} from "angular2/http";
import {HTTP_PROVIDERS} from "angular2/http";

import "rxjs/Rx";
import { Observable } from "rxjs/Observable";

@Component({
    selector: "MusicSchedulerApp",
    providers: [HTTP_PROVIDERS],
    templateUrl: "./app/html/main.html"
})
export class App {

    private info = new Info();
    private showInfoSection = false;

    constructor(private _http: Http) {}

    /**
     * Setup timer to poll for information
     */
    ticks = 0;
    ngOnInit() {
        let timer = Observable.timer(1, 5000);
        timer.subscribe((t: number) => this.ticks = t);
        timer.subscribe((t: number) => {
            this.getInfo();
        });
    }

    /**
     * Gets the music info  from the server
     */
    getInfo() {
        this._http.get("api/info")
            .map(this.parseResponse)
            .catch(this.handleError)
            .subscribe(
                (info: Info) => this.info = info
            );
    }

    /**
     * Pauses or resumes the music
     */
    pauseResume() {
        this.showInfoSection = true;
        console.log("Hallo!");
        this._http.post("api/pauseResume", "")
            .map(this.parseResponse)
            .catch(this.handleError)
            .subscribe();
    }

    /**
     * Show info view or not
     */
    showInfo(value: boolean) {
        this.showInfoSection = value;
    }

    /**
     * Pauses or resumes the music
     */
    skip() {
        this._http.post("api/skip", "")
            .map(this.parseResponse)
            .catch(this.handleError)
            .subscribe();
    }

    /**
     * Books the specified song
     */
    bookSong(url: HTMLInputElement, username: HTMLInputElement) {

        var urlToSend = url.value;
        url.value = "";
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        this._http.post("api/bookSong", JSON.stringify({ "URL": urlToSend, "Name": username.value}), { headers: headers })
            .map(this.parseResponse)
            .catch(this.handleError)
            .subscribe();
    }

    private parseResponse(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error(`Response status: ${res.status}`);
        }

        const body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        console.log(error);
        return Observable.throw(error.message);
    }
}