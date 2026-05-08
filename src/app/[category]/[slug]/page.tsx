import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'

import {
  getMaterial,
  getMaterialsByCategory,
  getStaticParamsForMaterials,
  parseSlides,
} from '@/lib/content'
import { SlideViewer } from '@/components/SlideViewer'
import { ArticleViewer } from '@/components/ArticleViewer'
import { Slide } from '@/components/Slide'
import { Expandable, ExpandableItem } from '@/components/slide-modes/Expandable'
import { Reveal, RevealItem } from '@/components/slide-modes/Reveal'
import { Flashcard } from '@/components/slide-modes/Flashcard'
import { Tabs, Tab } from '@/components/slide-modes/Tabs'

type Params = Promise<{ category: string; slug: string }>

export async function generateStaticParams() {
  return getStaticParamsForMaterials()
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category, slug } = await params
  const material = getMaterial(category, slug)
  if (!material) return {}
  return {
    title: `${material.frontmatter.title} | Guides`,
    description: material.frontmatter.description,
  }
}

const mdxComponents = {
  Slide,
  Expandable,
  ExpandableItem,
  Reveal,
  RevealItem,
  Flashcard,
  Tabs,
  Tab,
}

const mdxOptions: Record<string, unknown> = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'append' }],
      [rehypePrettyCode, { theme: 'one-dark-pro' }],
    ],
  },
}

export default async function MaterialPage({ params }: { params: Params }) {
  const { category, slug } = await params
  const material = getMaterial(category, slug)
  if (!material) notFound()

  const { frontmatter, content } = material

  if (frontmatter.type === 'slides') {
    const slides = parseSlides(content)
    return (
      <SlideViewer totalSlides={slides.length} title={frontmatter.title}>
        {slides.map((slideContent, i) => (
          <div key={i}>
            <MDXRemote
              source={slideContent}
              components={mdxComponents}
              options={mdxOptions}
            />
          </div>
        ))}
      </SlideViewer>
    )
  }

  // Article
  const siblings = getMaterialsByCategory(category)
  const idx = siblings.findIndex((m) => m.slug === slug)
  const prev = idx > 0 ? siblings[idx - 1] : undefined
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : undefined

  return (
    <ArticleViewer
      prevMaterial={prev ? { title: prev.frontmatter.title, href: `/${category}/${prev.slug}` } : undefined}
      nextMaterial={next ? { title: next.frontmatter.title, href: `/${category}/${next.slug}` } : undefined}
    >
      <MDXRemote
        source={content}
        components={mdxComponents}
        options={mdxOptions}
      />
    </ArticleViewer>
  )
}
