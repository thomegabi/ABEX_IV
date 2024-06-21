## Tabelas do Banco de Dados

### T_Perguntas
| Coluna         | Tipo | Descrição             |
|----------------|------|-----------------------|
| Per_Codigo (PK)| int  | Código da pergunta    |
| Per_descricao  | text | Descrição da pergunta |
| Per_tipo       | text | Tipo da pergunta      |
| Per_obrigatoria| bool | Pergunta obrigatória  |

### T_Usuário
| Coluna        | Tipo    | Descrição         |
|---------------|---------|-------------------|
| Usu_Codigo (PK)| int    | Código do usuário |
| Usu_Nome      | text    | Nome do usuário   |
| Usu_Email     | text    | E-mail do usuário |
| Usu_Login     | text    | Login do usuário  |
| Usu_Senha     | text    | Senha do usuário  |
| Usu_Ativo     | bool    | Usuário ativo     |
| Usu_Telefone  | text    | Telefone do usuário|

### T_Resposta
| Coluna        | Tipo    | Descrição             |
|---------------|---------|-----------------------|
| Res_Codigo (PK)| int    | Código da resposta    |
| Res_Descrição | text    | Descrição da resposta |
| Per_Codigo    | int     | Código da pergunta    |

### T_Formulario
| Coluna        | Tipo | Descrição                |
|---------------|------|--------------------------|
| For_codigo (PK)| int  | Código do formulário     |
| For_Nome      | text | Nome do formulário       |
| For_Descrição | text | Descrição do formulário  |

### T_Formulario_Pergunta
| Coluna        | Tipo | Descrição                |
|---------------|------|--------------------------|
| FoP_Codigo (PK)| int  | Código da relação        |
| For_Codigo    | int  | Código do formulário     |
| Per_Codigo    | int  | Código da pergunta       |

### T_Resposta_Usuario
| Coluna        | Tipo | Descrição                  |
|---------------|------|----------------------------|
| ReU_Codigo (PK)| int  | Código da resposta do usuário |
| Res_Codigo    | int  | Código da resposta         |
| Per_Codigo    | int  | Código da pergunta         |
| Usu_Codigo    | int  | Código do usuário          |
| For_Codigo    | int  | Código do formulário       |

### T_Resposta_Pontuacao
| Coluna           | Tipo | Descrição                  |
|------------------|------|----------------------------|
| ReP_Codigo (PK)  | int  | Código da pontuação        |
| ReU_Codigo (FK)  | int  | Código da resposta do usuário |
| Pontuacao        | int  | Pontuação atribuída        |


