# 006 A. RC

^ Back to [parent](./001-planification.md)

## RC features

Features to consider when development and testing would reach a release phase.


- [ ] SSL Certificate for HTTPS
- [ ] Rate limiter on proxy
- [ ] Production environment
- [ ] Production database
- [ ] Production log level & strategy
- [ ] Harden features
  - Rate limit / Cooldown
  - CSRF protection
  - Input sanitation
  - Health monitoring
  - Alerting strategy
  - Secret stores
  - Harden containers. example: [https://github.com/littlebaydigital/docker-alpine-hardened/blob/master/harden.sh](https://github.com/littlebaydigital/docker-alpine-hardened/blob/master/harden.sh)

# 006 B. Going further

- i18n
- elastic/fuzzy search: to warn users about duplicates

# Next

[Database design](./007-database-design.md)