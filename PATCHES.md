# Patches

- Memory leak building many subpackages, keep track of:
  <https://github.com/ng-packagr/ng-packagr/issues/1325>

diff --git a/node_modules/@crexi-dev/ng-packagr/lib/ng-package/entry-point/entry-point.transform.js b/node_modules/@crexi-dev/ng-packagr/lib/ng-package/entry-point/entry-point.transform.js
index 4381e88..1650f37 100755
--- a/node_modules/@crexi-dev/ng-packagr/lib/ng-package/entry-point/entry-point.transform.js
+++ b/node_modules/@crexi-dev/ng-packagr/lib/ng-package/entry-point/entry-point.transform.js
@@ -15,6 +15,7 @@ const select_1 = require("../../graph/select");
const transform_1 = require("../../graph/transform");
const log = require("../../utils/log");
const nodes_1 = require("../nodes");
+const ts = require("typescript");
/\*\*

- A re-write of the `transformSources()` script that transforms an entry point from sources to distributable format.
- @@ -58,5 +59,15 @@ compileTs,
  writeBundles, writePackage, transform_1.transformFromPromise((graph) => \_\_awaiter(void 0, void 0, void 0, function\* () {
  const entryPoint = graph.find(nodes_1.byEntryPoint().and(select_1.isInProgress));
  entryPoint.state = node_1.STATE_DONE;

* if (global.gc) {
*      entryPoint.cache.oldPrograms = undefined;
*      entryPoint.cache.sourcesFileCache.clear();
*      entryPoint.cache.analysesSourcesFileCache.clear();
*      entryPoint.cache.moduleResolutionCache = ts.createModuleResolutionCache(process.cwd(), s => s);
*      entryPoint.cache.rollupFESMCache = undefined;
*      entryPoint.cache.rollupUMDCache = undefined;
*      global.gc();
*      log.msg(`Clearing '${entryPoint.data.entryPoint.moduleId}' entrypoint cache (Heapsize: ${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MiB)`);
* }
  })));
  //# sourceMappingURL=entry-point.transform.js.map
