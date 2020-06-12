import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from "@pnp/sp";

import { SampleService, ISampleService } from 'sp-fx-library';

import styles from './SampleWebPartWebPart.module.scss';
import * as strings from 'SampleWebPartWebPartStrings';

export interface ISampleWebPartWebPartProps {
  description: string;
}

export default class SampleWebPartWebPart extends BaseClientSideWebPart<ISampleWebPartWebPartProps> {
  private sampleService : ISampleService;
  private lists : any[];

  public onInit(): any {
    this.sampleService = this.context.serviceScope.consume(SampleService.serviceKey);
    return super.onInit().then(() => {

      // This should not be set here, but in the SampleService as the data is retrieved by the service
      // But this is the only place where we have this.context

      // Anyays this doesn't appear to be working as a separate instance of "sp" is created in the library component
      // Refer comments in SampleLibraryLibrary.ts      
      sp.setup({
        spfxContext : this.context
      });
    });
  } 

  protected get isRenderAsync(): boolean {
    return true;
  }
  
  public render():void {
    this.sampleService.getLists().then((lists) => {
      this.lists = lists;
      this.renderCompleted();
    }).catch((err) => {
      console.error(err);
      this.renderCompleted();
    });
  }

  protected renderCompleted() {
    super.renderCompleted();

    this.domElement.innerHTML = `
      <div class="${ styles.sampleWebPart }">
        <div class="${ styles.container }">
          <div class="${ styles.row }">
            <div class="${ styles.column }">
              <p>Lists Count: ${ this.lists ? this.lists.length : 0 }</p>
            </div>
          </div>
        </div>
      </div>`;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
