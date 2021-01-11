import { pipe } from 'rxjs';
import { createModuleResolutionCache } from 'typescript';
import { STATE_DONE } from '../../graph/node';
import { isInProgress } from '../../graph/select';
import { Transform, transformFromPromise } from '../../graph/transform';
import * as log from '../../utils/log';
import { byEntryPoint } from '../nodes';

/**
 * A re-write of the `transformSources()` script that transforms an entry point from sources to distributable format.
 *
 * Sources are TypeScript source files accompanied by HTML templates and xCSS stylesheets.
 * See the Angular Package Format for a detailed description of what the distributables include.
 *
 * The current transformation pipeline can be thought of as:
 *
 *  - clean
 *  - compileTs
 *  - downlevelTs
 *  - writeBundles
 *    - bundleToFesm15
 *    - bundleToUmd
 *    - bundleToUmdMin
 *  - relocateSourceMaps
 *  - writePackage
 *   - copyStagedFiles (bundles, esm, dts, metadata, sourcemaps)
 *   - writePackageJson
 *
 * The transformation pipeline is pluggable through the dependency injection system.
 * Sub-transformations are passed to this factory function as arguments.
 *
 * @param compileTs Transformation compiling typescript sources to ES2015 modules.
 * @param writeBundles Transformation flattening ES2015 modules to ESM2015, UMD, and minified UMD.
 * @param writePackage Transformation writing a distribution-ready `package.json` (for publishing to npm registry).
 */
export const entryPointTransformFactory = (
  compileTs: Transform,
  writeBundles: Transform,
  writePackage: Transform,
): Transform =>
  pipe(
    //tap(() => log.info(`Building from sources for entry point`)),

    transformFromPromise(async graph => {
      // Peek the first entry point from the graph
      const entryPoint = graph.find(byEntryPoint().and(isInProgress));
      log.msg('\n------------------------------------------------------------------------------');
      log.msg(`Building entry point '${entryPoint.data.entryPoint.moduleId}'`);
      log.msg('------------------------------------------------------------------------------');
    }),
    // TypeScript sources compilation
    compileTs,
    // After TypeScript: bundling and write package
    writeBundles,
    writePackage,
    transformFromPromise(async graph => {
      const entryPoint = graph.find(byEntryPoint().and(isInProgress)) as any;
      entryPoint.state = STATE_DONE;
      if (global.gc) {
        entryPoint.cache.oldPrograms = undefined;
        entryPoint.cache.sourcesFileCache.clear();
        entryPoint.cache.analysesSourcesFileCache.clear();
        entryPoint.cache.moduleResolutionCache = createModuleResolutionCache(process.cwd(), s => s);
        entryPoint.cache.rollupFESMCache = undefined;
        entryPoint.cache.rollupUMDCache = undefined;
        global.gc();
        log.msg(
          `Clearing '${entryPoint.data.entryPoint.moduleId}' entrypoint cache (Heapsize: ${Math.round(
            process.memoryUsage().heapTotal / 1024 / 1024,
          )} MiB)`,
        );
      }
    }),

    //tap(() => log.info(`Built.`))
  );
