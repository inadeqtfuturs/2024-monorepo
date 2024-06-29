const classname = (classnames: ((boolean | string) | undefined)[]) =>
  classnames.filter((x) => !!x).join(', ');

export default classname;
