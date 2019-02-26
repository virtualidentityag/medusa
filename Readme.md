# Medusa 🐍

Medusa is a simple connector to help you use [Percy.io](https://percy.io) with puppeteer in your project.

## Installation
`npm i @virtualidentity/medusa --save-dev`

## Usage
To run medusa, you have to have the percy environment values set.  
```
export PERCY_BRANCH=YourBranch
export PERCY_TOKEN=YourToken
```

Then setup an npm script to run medusa  
```json
{
  ...
  "scripts": {
    ...
    "test:regression": "medusa"
  }
  ...
}
```
Now you are ready and can use it with:  
`npm run test:regression`

## Configure
You can configure medusa by passing a configuration file via `--config`:
```
medusa --config path/to/config.json
```
This defaults to `medusa.json`.
  
The config file can set the following values:  
  
| Name           | Description                                      | Default |
|----------------|--------------------------------------------------|---------|
| `targetDir`    | The directory where to search for `.html` files. | `dist`  |
| `ignoreFiles`  | Files to ignore for screenshots.                 | `[]`    |
| `screenWidths` | Screen widths to screenshot and send to percy    | `[320]` |


## Hide markup
Medusa brings its own CSS class which helps you to hide elements in the visual regression test. To hide an element just ass the class `hide-in-medusa` to it:
```html
<div class="hide-in-medusa">...</div>
```

## Handle Animations
It's recommended to hide animated components or add them to the ignore list, because it can't be guaranteed that the animations are captured at the same state of animation each time, this causes diffs in the snapshots where really are none.

## Different Environments
The simpelest way to have different environments 
