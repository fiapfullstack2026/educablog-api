const serverUrl = process.env.API_URL ?? 'http://localhost:3000'
const envinroment =
  process.env.NODE_ENV === 'production' ? 'Produção' : 'Desenvolvimento'
export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'EducaBlog API',
    version: '1.0.0',
    description:
      'API de blogging dinâmico para professores da rede pública — FIAP PosTech FSDT Fase 02',
  },
  servers: [{ url: serverUrl, description: envinroment }],
  tags: [
    { name: 'Posts', description: 'Gerenciamento de postagens' },
    { name: 'Usuários', description: 'Cadastro e autenticação' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '665a1b2c3d4e5f6a7b8c9d0e' },
          username: { type: 'string', example: 'maria' },
          isTeacher: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      UserUpdateInput: {
        type: 'object',
        properties: {
          username: { type: 'string', example: 'maria' },
          password: { type: 'string', example: 'nova-senha' },
          isTeacher: { type: 'boolean', example: true },
        },
      },
      Post: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '665a1b2c3d4e5f6a7b8c9d0e' },
          title: { type: 'string', example: 'Introdução à Física Quântica' },
          discipline: { type: 'string', example: 'Física' },
          content: { type: 'string', example: 'Nesta aula vamos explorar...' },
          teacher: { type: 'string', example: 'Prof. Maria Silva' }, // era author
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      PostInput: {
        type: 'object',
        required: ['title', 'discipline', 'content', 'teacher'],
        properties: {
          title: {
            type: 'string',
            maxLength: 200,
            example: 'Introdução à Física Quântica',
          },
          discipline: {
            type: 'string',
            example: 'Física',
          },
          content: { type: 'string', example: 'Nesta aula vamos explorar...' },
          teacher: { type: 'string', example: 'Prof. Maria Silva' },
        },
      },
      PostUpdate: {
        type: 'object',
        properties: {
          title: { type: 'string', maxLength: 200 },
          discipline: { type: 'string' },
          content: { type: 'string' },
          teacher: { type: 'string' },
        },
      },
      UserRegisterInput: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string', example: 'prof.joao' },
          password: { type: 'string', example: 'senha123' },
          isTeacher: { type: 'boolean', example: true },
        },
      },
      UserSignInInput: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string', example: 'prof.joao' },
          password: { type: 'string', example: 'senha123' },
        },
      },
      AuthToken: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
      NotFoundError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Não encontrado' },
        },
      },
      BadRequestError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Dados inválidos' },
        },
      },
      NotAuthorizedError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Token não informado' },
        },
      },
      ForbiddenError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Acesso proibido' },
        },
      },
      InvalidCredentialsError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Credenciais inválidas' },
        },
      },
      UserAlreadyExistsError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: {
            type: 'string',
            example: 'Usuário com este username e perfil já existe',
          },
        },
      },
      SuccessMessage: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Remoção realizada com sucesso' },
        },
      },
    },
  },
  paths: {
    '/user/register': {
      post: {
        tags: ['Usuários'],
        summary: 'Cadastra um novo usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserRegisterInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Usuário criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'Usuário prof.joao criado com sucesso',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestError' },
              },
            },
          },
          409: {
            description: 'Usuário já existe',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserAlreadyExistsError' },
              },
            },
          },
        },
      },
    },
    '/user/signin': {
      post: {
        tags: ['Usuários'],
        summary: 'Autentica um usuário e retorna um token JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserSignInInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Autenticado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthToken' },
              },
            },
          },
          401: {
            description: 'Credenciais inválidas',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/InvalidCredentialsError',
                },
              },
            },
          },
          404: {
            description: 'Usuário não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundError' },
              },
            },
          },
        },
      },
    },
    '/user': {
      get: {
        tags: ['Usuários'],
        summary: 'Lista usuários (professor: todos; aluno: somente ele mesmo)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'isTeacher',
            required: false,
            schema: { type: 'boolean' },
            description: 'Filtra por professores (true) ou alunos (false)',
          },
        ],
        responses: {
          200: {
            description: 'Lista retornada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    count: { type: 'integer' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Token não informado ou inválido' },
          403: { description: 'Token sem id; refaça o login' },
        },
      },
    },
    '/user/{id}': {
      get: {
        tags: ['Usuários'],
        summary: 'Retorna um usuário pelo ID (professor: qualquer; aluno: somente o próprio)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'ID do usuário',
          },
        ],
        responses: {
          200: {
            description: 'Usuário encontrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          401: { description: 'Token não informado ou inválido' },
          403: { description: 'Aluno acessando outro usuário' },
          404: { description: 'Usuário não encontrado' },
        },
      },
      put: {
        tags: ['Usuários'],
        summary: 'Atualiza um usuário (professor: qualquer; aluno: somente o próprio, sem alterar isTeacher)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'ID do usuário',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserUpdateInput' },
            },
          },
        },
        responses: {
          204: { description: 'Usuário atualizado' },
          400: { description: 'Dados inválidos' },
          401: { description: 'Token não informado ou inválido' },
          403: { description: 'Aluno acessando outro usuário ou alterando isTeacher' },
          404: { description: 'Usuário não encontrado' },
          409: { description: 'Usuário com este username e perfil já existe' },
        },
      },
      delete: {
        tags: ['Usuários'],
        summary: 'Remove um usuário (somente professores)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'ID do usuário',
          },
        ],
        responses: {
          204: { description: 'Usuário removido' },
          401: { description: 'Token não informado ou inválido' },
          403: { description: 'Acesso restrito a professores' },
          404: { description: 'Usuário não encontrado' },
        },
      },
    },
    '/posts': {
      get: {
        tags: ['Posts'],
        summary: 'Lista todos os posts',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista retornada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 2 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Post' },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Não autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotAuthorizedError' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Posts'],
        summary: 'Cria um novo post',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PostInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Post criado com sucesso',
          },
          400: {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestError' },
              },
            },
          },
          401: {
            description: 'Não autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotAuthorizedError' },
              },
            },
          },
          403: {
            description: 'Proibido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ForbiddenError' },
              },
            },
          },
        },
      },
    },
    '/posts/search': {
      get: {
        tags: ['Posts'],
        summary: 'Busca posts por palavra-chave',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'q',
            required: true,
            schema: { type: 'string' },
            description: 'Termo buscado no título e conteúdo',
            example: 'física',
          },
        ],
        responses: {
          200: {
            description: 'Resultados da busca',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 1 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Post' },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Parâmetro "q" ausente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestError' },
              },
            },
          },
          401: {
            description: 'Não autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotAuthorizedError' },
              },
            },
          },
        },
      },
    },
    '/posts/{id}': {
      get: {
        tags: ['Posts'],
        summary: 'Retorna um post pelo ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'ID do post',
          },
        ],
        responses: {
          200: {
            description: 'Post encontrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Post' },
                  },
                },
              },
            },
          },
          401: {
            description: 'Não autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotAuthorizedError' },
              },
            },
          },
          404: {
            description: 'Post não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundError' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Posts'],
        summary: 'Atualiza um post existente',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PostUpdate' },
            },
          },
        },
        responses: {
          204: {
            description: 'Post atualizado com sucesso',
          },
          400: {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestError' },
              },
            },
          },
          401: {
            description: 'Não autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotAuthorizedError' },
              },
            },
          },
          403: {
            description: 'Proibido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ForbiddenError' },
              },
            },
          },
          404: {
            description: 'Post não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundError' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Posts'],
        summary: 'Remove um post',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          204: {
            description: 'Post removido com sucesso',
          },
          400: {
            description: 'Dados inválidos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BadRequestError' },
              },
            },
          },
          401: {
            description: 'Não autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotAuthorizedError' },
              },
            },
          },
          403: {
            description: 'Proibido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ForbiddenError' },
              },
            },
          },
          404: {
            description: 'Post não encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NotFoundError' },
              },
            },
          },
        },
      },
    },
  },
}
