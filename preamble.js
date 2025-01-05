const preamble = assistant =>
  assistant.preamble || (assistant.assistant && preamble(assistant.assistant));

export default preamble;
  