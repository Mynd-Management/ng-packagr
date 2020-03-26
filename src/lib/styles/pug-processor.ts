import * as log from '../../../util/log';
const pug = require('pug');

export const pugProcessor = (filePath: string, content: string): string => {
  // Render pug
  log.debug(`rendering pug from ${filePath}`);
  return pug.render(content, { doctype: 'html', filename: filePath });
};
