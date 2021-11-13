import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

const fileCache = localForage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {

      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: "jsx",
          contents: inputCode,
        };
      })

    build.onLoad({ filter: /.*/ }, async (args: any) => {
      // check to see if we have alread fetched this file
      // and if its in cache
      const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
        args.path
      );

      // if it is, return immediately
      if (cachedResult) {
        return cachedResult;
      }
    })

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        const contents = `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
          `

        // so esbuild knows it will be jsx
        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        //store response in cache
        await fileCache.setItem(args.path, result);

        return result;
      })
      // returning contents instead of esbuild trying to load on its own
      // we are overwriting functionality here
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        // so esbuild knows it will be jsx
        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        //store response in cache
        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
