module.exports = {
  prompts: {
    name: {
      type: 'string',
      required: true,
      message: 'Nome do projeto'
    },
    description: {
      type: 'string',
      required: true,
      message: 'Descrição'
    },
    author: {
      type: 'string',
      message: 'Autor'
    }
  },
  completeMessage: 'Projeto criado!'
};