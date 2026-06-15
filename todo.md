# SRA-ES TV - TODO

## Banco de Dados
- [x] Inicializar projeto com scaffolding web-db-user
- [x] Criar tabela de vídeos (videos) com campos: id, title, url, order, isActive, createdAt, updatedAt
- [x] Gerar e executar migration SQL do Drizzle

## Backend (Node.js + Express + tRPC)
- [x] Implementar procedures tRPC para gerenciar playlist:
  - [x] `videos.list` - Listar todos os vídeos (público para tela de exibição)
  - [x] `videos.create` - Criar novo vídeo (protegido)
  - [x] `videos.update` - Atualizar vídeo (protegido)
  - [x] `videos.delete` - Deletar vídeo (protegido)
  - [x] `videos.reorder` - Reordenar vídeos (protegido)
- [x] Implementar upload de vídeos para S3 via tRPC
- [x] Criar helpers de banco de dados em server/db.ts

## Frontend - Tela de Exibição (Display)
- [x] Criar componente VideoPlayer fullscreen
- [x] Implementar lógica de looping infinito automático
- [x] Criar componente Overlay institucional com:
  - [x] Logo/Identidade SRA-ES
  - [x] Nome do órgão
  - [x] Informações do vídeo em exibição
- [x] Criar componente Clock com relógio digital em tempo real
- [x] Implementar transições suaves com Framer Motion entre vídeos
- [x] Implementar polling automático para atualizar playlist a cada 30s
- [x] Criar tela de carregamento elegante

## Frontend - Painel Administrativo
- [x] Criar layout do painel admin com autenticação
- [x] Implementar tabela de vídeos com:
  - [x] Coluna de ordem (setas para mover)
  - [x] Status ativo/inativo (toggle)
  - [x] Ações (editar, deletar)
- [x] Criar formulário para adicionar novo vídeo
- [ ] Implementar upload de vídeo com feedback de progresso
- [x] Criar modal/drawer para editar vídeo existente
- [x] Implementar confirmação antes de deletar vídeo

## Design Visual
- [x] Paleta de cores: Azul GOV.BR, branco, cinza escuro, preto fosco
- [x] Tipografia elegante e minimalista
- [x] Animações suaves com Framer Motion
- [x] Responsividade para Full HD, 4K e ultrawide

## Testes
- [x] Escrever testes vitest para procedures tRPC
- [x] Testar procedures de vídeos (8 testes passando)
- [x] Testar upload e persistência de vídeos

## Deploy e Publicação
- [x] Criar checkpoint final
- [x] Publicar projeto
