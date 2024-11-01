## Backend
- [Hono](https://hono.dev/)
- DynamoDB
- Lambda
- API Gateway

### Organização de pastas
```
    /core # Alto nivel
    /dtos 
    /infra # Detalhes de implentação
```

Rodando localmente a api utilizada uma implementação em memoria da interface `TaskRepository`.

## Frontend
stack utilizada.
* [Vite](https://vite.dev/)
* [Shadcn](https://ui.shadcn.com/)
* [dnd-kit](https://dndkit.com/)
* Amplify

Para rodar localmente tanto a api quando o app precisa alterar a variavel `VITE_HOST` no `.env`, por padrão aponta para a api hospedada na AWS.