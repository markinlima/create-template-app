/** What to do when a build step cannot download packages because of the DNS of the BuildKit. */
export const DNS_HINT = [
  "Se o erro foi ao baixar pacotes (bun i, apk, apt-get), é provável que seja o DNS do build:",
  "o BuildKit copia os DNS IPv6 do host, que a rede de build não alcança.",
  "",
  "Pode resolver: no daemon.json do Docker defina DNS IPv4 para o daemon, por exemplo",
  '  { "dns": ["1.1.1.1", "8.8.8.8"] }',
  "",
  "Alternativa sem mexer no daemon: crie um builder com DNS próprio e use-o:",
  '  printf \'[dns]\\n  nameservers = ["1.1.1.1", "8.8.8.8"]\\n\' > buildkitd.toml',
  "  docker buildx create --name dnsfix --driver docker-container --buildkitd-config buildkitd.toml",
  "  docker buildx use dnsfix",
].join("\n");
