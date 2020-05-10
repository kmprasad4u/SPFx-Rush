## SPFx-Rush
Using Rush & SPFx-Fast-Serve with SPFx projects
https://github.com/microsoft/rushstack/issues/1863
https://github.com/s-KaiNet/spfx-fast-serve/issues/6

### Installing Packages (one of below commands)
> rush update [--full]

### Bundling & Creating SPFx Packages
> rush package

### Building the code
> rush build

### Serving 
> rush serve --to sp-fx-web-part2 --verbose

### Serving (Traditional)
* Change Site Url in packages\SPFx-WebPart\Config\serve.json
* In Terminal 1
    * cd packages\SPFx-Library
    * npm run serve
* In Terminal 2
    * cd packages\SPFx-WebPart
    * npm run serve

### Configurations
* rush.json
* common\config\command-line.json
* scripts section in "packages\<package>\package.json"

### References
* https://www.vrdmn.com/2019/04/using-microsoft-rush-to-manage-spfx.html
* https://rushjs.io/pages/intro/get_started/
* https://github.com/s-KaiNet/spfx-fast-serve/blob/master/LibraryComponents.md