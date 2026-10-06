/* Calcula o valor de cor que atinge a razão de contraste desejada.
   Uso: node scripts/contraste.mjs "#6B7382" "#F7F5F0" 4.5 [--escurecer|--clarear] */

const hexParaRgb = (h) => {
  const s = h.replace('#', '');
  const n = s.length === 3 ? s.split('').map((c) => c + c).join('') : s;
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
};
const rgbParaHex = (rgb) => '#' + rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('').toUpperCase();

const lum = (rgb) => {
  const c = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const razao = (a, b) => {
  const la = lum(a), lb = lum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

const [corTexto, corFundo, alvoArg, direcaoArg] = process.argv.slice(2);
const alvo = Number(alvoArg) || 4.5;
const direcao = direcaoArg || '--escurecer';

const texto = hexParaRgb(corTexto);
const fundo = hexParaRgb(corFundo);
const atual = razao(texto, fundo);

console.log(`atual: ${corTexto} sobre ${corFundo} = ${atual.toFixed(2)}:1 (alvo ${alvo})`);
if (atual >= alvo) {
  console.log('já passa — nada a fazer');
  process.exit(0);
}

/* Caminha a cor na direção pedida até cruzar o alvo, preservando o matiz. */
const passo = direcao === '--clarear' ? 1 : -1;
for (let delta = 1; delta <= 255; delta++) {
  const tentativa = texto.map((v) => v + passo * delta);
  if (tentativa.some((v) => v < 0 || v > 255)) break;
  const r = razao(tentativa, fundo);
  if (r >= alvo) {
    console.log(`sugestão: ${rgbParaHex(tentativa)} = ${r.toFixed(2)}:1 (delta ${passo * delta})`);
    /* Uma alternativa mais escura, para dar folga. */
    for (let d2 = delta + 2; d2 <= delta + 24; d2++) {
      const t2 = texto.map((v) => v + passo * d2);
      if (t2.some((v) => v < 0 || v > 255)) break;
      const r2 = razao(t2, fundo);
      if (r2 >= alvo + 0.1) {
        console.log(`com folga:  ${rgbParaHex(t2)} = ${r2.toFixed(2)}:1`);
        break;
      }
    }
    process.exit(0);
  }
}
console.log('não achei valor nessa direção');
