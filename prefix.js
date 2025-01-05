const prefix = (commands, prefix) => commands.map(command => ({
  ...command, name: `${prefix}.${command.name}`
}));

export default prefix;
