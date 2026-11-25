import { onRequest as __c__id__js_onRequest } from "C:\\Users\\ALIENWARE\\OneDrive\\1_PROJETOS\\Seu Chef em Casa\\repo\\.claude\\worktrees\\vibrant-merkle-8aa2af\\functions\\c\\[id].js"
import { onRequest as __chef__slug__js_onRequest } from "C:\\Users\\ALIENWARE\\OneDrive\\1_PROJETOS\\Seu Chef em Casa\\repo\\.claude\\worktrees\\vibrant-merkle-8aa2af\\functions\\chef\\[slug].js"
import { onRequest as __api___rota___js_onRequest } from "C:\\Users\\ALIENWARE\\OneDrive\\1_PROJETOS\\Seu Chef em Casa\\repo\\.claude\\worktrees\\vibrant-merkle-8aa2af\\functions\\api\\[[rota]].js"
import { onRequest as __m___rota___js_onRequest } from "C:\\Users\\ALIENWARE\\OneDrive\\1_PROJETOS\\Seu Chef em Casa\\repo\\.claude\\worktrees\\vibrant-merkle-8aa2af\\functions\\m\\[[rota]].js"
import { onRequest as __personal_chef___cidade___js_onRequest } from "C:\\Users\\ALIENWARE\\OneDrive\\1_PROJETOS\\Seu Chef em Casa\\repo\\.claude\\worktrees\\vibrant-merkle-8aa2af\\functions\\personal-chef\\[[cidade]].js"
import { onRequest as __servicos___servico___js_onRequest } from "C:\\Users\\ALIENWARE\\OneDrive\\1_PROJETOS\\Seu Chef em Casa\\repo\\.claude\\worktrees\\vibrant-merkle-8aa2af\\functions\\servicos\\[[servico]].js"
import { onRequest as __admin_js_onRequest } from "C:\\Users\\ALIENWARE\\OneDrive\\1_PROJETOS\\Seu Chef em Casa\\repo\\.claude\\worktrees\\vibrant-merkle-8aa2af\\functions\\admin.js"
import { onRequest as __sitemap_xml_js_onRequest } from "C:\\Users\\ALIENWARE\\OneDrive\\1_PROJETOS\\Seu Chef em Casa\\repo\\.claude\\worktrees\\vibrant-merkle-8aa2af\\functions\\sitemap.xml.js"
import { onRequest as ___middleware_js_onRequest } from "C:\\Users\\ALIENWARE\\OneDrive\\1_PROJETOS\\Seu Chef em Casa\\repo\\.claude\\worktrees\\vibrant-merkle-8aa2af\\functions\\_middleware.js"

export const routes = [
    {
      routePath: "/c/:id",
      mountPath: "/c",
      method: "",
      middlewares: [],
      modules: [__c__id__js_onRequest],
    },
  {
      routePath: "/chef/:slug",
      mountPath: "/chef",
      method: "",
      middlewares: [],
      modules: [__chef__slug__js_onRequest],
    },
  {
      routePath: "/api/:rota*",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api___rota___js_onRequest],
    },
  {
      routePath: "/m/:rota*",
      mountPath: "/m",
      method: "",
      middlewares: [],
      modules: [__m___rota___js_onRequest],
    },
  {
      routePath: "/personal-chef/:cidade*",
      mountPath: "/personal-chef",
      method: "",
      middlewares: [],
      modules: [__personal_chef___cidade___js_onRequest],
    },
  {
      routePath: "/servicos/:servico*",
      mountPath: "/servicos",
      method: "",
      middlewares: [],
      modules: [__servicos___servico___js_onRequest],
    },
  {
      routePath: "/admin",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__admin_js_onRequest],
    },
  {
      routePath: "/sitemap.xml",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__sitemap_xml_js_onRequest],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "",
      middlewares: [___middleware_js_onRequest],
      modules: [],
    },
  ]