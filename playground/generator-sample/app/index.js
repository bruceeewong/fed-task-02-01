const Generator = require("yeoman-generator");

class SampleGenerator extends Generator {
  writing() {
    const tmpl = this.templatePath("foo.txt");
    const output = this.destinationPath("foo.txt");
    const context = { title: "Hello", success: false };

    this.fs.copyTpl(tmpl, output, context);
  }
}

module.exports = SampleGenerator;
