import { default as copy } from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'dist/debug/index.js',
    output: [
      {
        file: 'dist/release/ludumdare32.bundle.min.js',
        name: 'version',
        plugins: [terser()]
      }
    ],
    plugins: [
      copy({
        targets: [
          {
            src: 'src/www/index.html',
            dest: 'dist/debug',
            transform: (contents) => {
              return contents.toString().replace('__SCRIPT__', 'index.js');
            }
          },
          {
            src: 'src/www/index.html',
            dest: 'dist/release',
            transform: (contents) => {
              return contents.toString().replace('__SCRIPT__', 'ludumdare32.bundle.min.js');
            }
          },
          { src: 'src/assets', dest: ['dist/debug', 'dist/release'] }
        ]
      })
    ]
  }
];
