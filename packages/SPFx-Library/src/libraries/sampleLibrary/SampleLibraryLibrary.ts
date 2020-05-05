import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
import { sp } from "@pnp/sp";

export interface ISampleService {
  getLists() : Promise<any[]>;
  getMockLists() : Promise<any[]>;
  getMockLists1() : Promise<any[]>;
}

export class SampleService implements ISampleService {

  public static readonly serviceKey : ServiceKey<ISampleService> = ServiceKey.create<ISampleService>('SPFx:SampleService', SampleService);    
  
  constructor(serviceScope : ServiceScope) {
    serviceScope.whenFinished(() => {  
      const pageContext = serviceScope.consume(PageContext.serviceKey);  
      
      // Cannot use this, as spfxContext expects this.context and not this.context.pageContext
      // Is there a way to get this.context using serviceScope ?
      //sp.setup({
        //spfxContext : pageContext  
      //})

      // Workaround works, but not sure if its the best approach
      // When this is not set, we get error in console
      // sp.setup({
      //   sp : {
      //     baseUrl : pageContext.web.absoluteUrl
      //   }
      // });
    });
  }

  public getLists(): Promise<any[]> {
    return sp.web.lists.get(); // Promise.resolve([{ Title : "test1" }, { Title : "test2"}]);
  }
  
  public getMockLists(): Promise<any[]> {
    return Promise.resolve([{ Title : "test1" }, { Title : "test2"}]);
  }

  public getMockLists1(): Promise<any[]> {
    return Promise.resolve([{ Title : "test1" }, { Title : "test2"}, { Title : "test3"}]);
  }
}
