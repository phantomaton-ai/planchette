import metamagic from 'metamagic';

const stringAttr = (desc) => ({
  description: desc,
  validate: (val) => typeof val === 'string'
});

export default function createCommands(workspace) {
  return [
    metamagic('open', 
      ({ file }) => workspace.open(file), 
      {
        attributes: {
          file: stringAttr('File to open')
        }
      }
    ),

    metamagic('close', 
      ({ file }) => workspace.close(file), 
      {
        attributes: {
          file: stringAttr('File to close')
        }
      }
    ),

    metamagic('focus', 
      ({ file }) => workspace.focus(file), 
      {
        attributes: {
          file: stringAttr('File to focus on')
        }
      }
    ),

    metamagic('before', 
      ({ target }) => workspace.current().before(target), 
      {
        attributes: {
          target: stringAttr('Text to position cursor before')
        }
      }
    ),

    metamagic('after', 
      ({ target }) => workspace.current().after(target), 
      {
        attributes: {
          target: stringAttr('Text to position cursor after')
        }
      }
    ),

    metamagic('select', 
      ({ start, end }) => workspace.current().select(start, end), 
      {
        attributes: {
          start: stringAttr('Start marker for text selection'),
          end: stringAttr('End marker for text selection')
        }
      }
    ),

    metamagic('drag', 
      ({ target }) => workspace.current().drag(target), 
      {
        attributes: {
          target: stringAttr('Text to drag selection to')
        }
      }
    ),

    metamagic('edit', 
      ({ content }) => workspace.current().edit(content), 
      {
        attributes: {
          content: stringAttr('Content to replace or insert')
        }
      }
    ),

    metamagic('scroll', 
      ({ lines }) => workspace.current().scroll(parseInt(lines)), 
      {
        attributes: {
          lines: {
            description: 'Number of lines to scroll',
            validate: (lines) => typeof lines === 'string' && !isNaN(parseInt(lines))
          }
        }
      }
    )
  ];
}