export namespace pinger {
	
	export class PingEventBad {
	    // Go type: time.Time
	    last_good?: any;
	
	    static createFrom(source: any = {}) {
	        return new PingEventBad(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.last_good = this.convertValues(source["last_good"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class PingEventGood {
	    // Go type: time.Time
	    last_bad?: any;
	    rtt: number;
	
	    static createFrom(source: any = {}) {
	        return new PingEventGood(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.last_bad = this.convertValues(source["last_bad"], null);
	        this.rtt = source["rtt"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class PingEventError {
	    message: string;
	
	    static createFrom(source: any = {}) {
	        return new PingEventError(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.message = source["message"];
	    }
	}
	export class PingEvent {
	    // Go type: time.Time
	    timestamp: any;
	    destination: string;
	    extra_info?: string;
	    error?: PingEventError;
	    good?: PingEventGood;
	    bad?: PingEventBad;
	    // Go type: PingEventDestroy
	    destroy?: any;
	
	    static createFrom(source: any = {}) {
	        return new PingEvent(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.timestamp = this.convertValues(source["timestamp"], null);
	        this.destination = source["destination"];
	        this.extra_info = source["extra_info"];
	        this.error = this.convertValues(source["error"], PingEventError);
	        this.good = this.convertValues(source["good"], PingEventGood);
	        this.bad = this.convertValues(source["bad"], PingEventBad);
	        this.destroy = this.convertValues(source["destroy"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	

}

