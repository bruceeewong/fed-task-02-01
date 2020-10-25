const Generator = require("yeoman-generator");

class SampleGenerator extends Generator {
  prompting() {
    return this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname,
      },
    ]).then((answers) => {
      console.log(answers);
      this.answers = answers;
    });
  }

  writing() {
    const tmpl = this.templatePath("bar.html");
    const output = this.destinationPath("bar.html");
    const context = this.answers;

    this.fs.copyTpl(tmpl, output, context);
  }
}

module.exports = SampleGenerator;
