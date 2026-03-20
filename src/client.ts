/**
 * UnitFYI API client — TypeScript wrapper for unitfyi.com REST API.
 *
 * Zero dependencies. Uses native `fetch`.
 *
 * @example
 * ```ts
 * import { UnitFYI } from "unitfyi";
 * const api = new UnitFYI();
 * const items = await api.search("query");
 * ```
 */

/** Generic API response type. */
export interface ApiResponse {
  [key: string]: unknown;
}

export class UnitFYI {
  private baseUrl: string;

  constructor(baseUrl = "https://unitfyi.com") {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  private async get<T = ApiResponse>(
    path: string,
    params?: Record<string, string>,
  ): Promise<T> {
    const url = new URL(path, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<T>;
  }

  // -- Endpoints ----------------------------------------------------------

  /** List all blog/categories. */
  async listBlog/categories(params?: Record<string, string>): Promise<ApiResponse> {
    return this.get("/api/v1/blog/categories/", params);
  }

  /** Get blog/category by slug. */
  async getBlog/category(slug: string): Promise<ApiResponse> {
    return this.get(`/api/v1/blog/categories/${slug}/`);
  }

  /** List all blog/posts. */
  async listBlog/posts(params?: Record<string, string>): Promise<ApiResponse> {
    return this.get("/api/v1/blog/posts/", params);
  }

  /** Get blog/post by slug. */
  async getBlog/post(slug: string): Promise<ApiResponse> {
    return this.get(`/api/v1/blog/posts/${slug}/`);
  }

  /** List all faqs. */
  async listFaqs(params?: Record<string, string>): Promise<ApiResponse> {
    return this.get("/api/v1/faqs/", params);
  }

  /** Get faq by slug. */
  async getFaq(slug: string): Promise<ApiResponse> {
    return this.get(`/api/v1/faqs/${slug}/`);
  }

  /** List all glossary. */
  async listGlossary(params?: Record<string, string>): Promise<ApiResponse> {
    return this.get("/api/v1/glossary/", params);
  }

  /** Get term by slug. */
  async getTerm(slug: string): Promise<ApiResponse> {
    return this.get(`/api/v1/glossary/${slug}/`);
  }

  /** Search across all content. */
  async search(query: string, params?: Record<string, string>): Promise<ApiResponse> {
    return this.get("/api/v1/search/", { q: query, ...params });
  }
}
