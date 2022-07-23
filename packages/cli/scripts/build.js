import esbuild from 'esbuild'
import pkg from '../package.json' assert {type: 'json'}

function build() {
  esbuild.buildSync({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    target: ['esnext'],
    external: [
      ...Object.keys(pkg.dependencies),
      '*.json'
    ],
    format: 'esm',
    outfile: 'bin/index.js',
    loader: {
      '.ts': 'ts'
    }
  });
}

build()