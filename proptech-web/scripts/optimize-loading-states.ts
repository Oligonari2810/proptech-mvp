#!/usr/bin/env tsx
/**
 * ⏳ OPTIMIZACIÓN MASIVA DE LOADING STATES
 * Reemplaza loadings básicos con LoadingOptimized en todas las páginas
 */
import fs from 'fs';
import path from 'path';

interface PageToOptimize {
  path: string;
  loadingTypes: string[];
}

class LoadingStatesOptimizer {
  private pagesToOptimize: PageToOptimize[] = [
    { path: 'app/comprar/page.tsx', loadingTypes: ['spinner', 'property'] },
    { path: 'app/alquilar/page.tsx', loadingTypes: ['spinner', 'property'] },
    { path: 'app/vender/page.tsx', loadingTypes: ['spinner', 'skeleton'] },
    { path: 'app/invertir/page.tsx', loadingTypes: ['spinner', 'property'] },
    { path: 'app/favoritos/page.tsx', loadingTypes: ['spinner', 'property'] },
    { path: 'app/calculadora-hipotecaria/page.tsx', loadingTypes: ['spinner'] },
    { path: 'app/calculadora-impuestos/page.tsx', loadingTypes: ['spinner'] }
  ];

  optimizeLoadingStates(): void {
    console.log('⏳ Optimizing loading states across all pages...\n');
    
    this.pagesToOptimize.forEach(page => {
      this.optimizePage(page);
    });
    
    console.log('\n✅ Loading states optimization completed!');
  }

  private optimizePage(pageConfig: PageToOptimize): void {
    const fullPath = path.join(process.cwd(), pageConfig.path);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Page not found: ${pageConfig.path}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    
    // Agregar import de LoadingOptimized si no existe
    if (!content.includes('LoadingOptimized')) {
      const importLine = "import { LoadingOptimized, PageLoading, SectionLoading } from '../components/LoadingOptimized';";
      
      if (content.includes("import React")) {
        content = content.replace(
          /(import\s+React[^\n]*\n)/,
          `$1${importLine}\n`
        );
      } else if (content.includes("'use client'")) {
        content = content.replace(
          /('use client'[^\n]*\n)/,
          `$1${importLine}\n`
        );
      } else {
        content = importLine + '\n' + content;
      }
      modified = true;
    }
    
    // Reemplazar loadings básicos
    const loadingReplacements = [
      {
        pattern: /<div[^>]*>\s*Loading\.\.\.\s*<\/div>/gi,
        replacement: '<LoadingOptimized type="spinner" size="md" />'
      },
      {
        pattern: /<div[^>]*>\s*Cargando\.\.\.\s*<\/div>/gi,
        replacement: '<LoadingOptimized type="spinner" size="md" />'
      },
      {
        pattern: /<div[^>]*className[^>]*animate-spin[^>]*>[\s\S]*?<\/div>/gi,
        replacement: '<LoadingOptimized type="spinner" size="md" />'
      },
      {
        pattern: /<div[^>]*className[^>]*spinner[^>]*>[\s\S]*?<\/div>/gi,
        replacement: '<LoadingOptimized type="spinner" size="md" />'
      },
      {
        pattern: /<div[^>]*className[^>]*skeleton[^>]*>[\s\S]*?<\/div>/gi,
        replacement: '<LoadingOptimized type="skeleton" />'
      }
    ];
    
    loadingReplacements.forEach(replacement => {
      if (replacement.pattern.test(content)) {
        content = content.replace(replacement.pattern, replacement.replacement);
        modified = true;
      }
    });
    
    // Optimizar condicionales de loading
    if (content.includes('loading') || content.includes('isLoading')) {
      // Buscar patrones como: {loading && <div>Loading...</div>}
      const loadingConditionPattern = /\{(loading|isLoading)\s*&&\s*<div[^>]*>[\s\S]*?Loading[\s\S]*?<\/div>\s*\}/gi;
      
      if (loadingConditionPattern.test(content)) {
        content = content.replace(
          loadingConditionPattern,
          `{loading ? <PageLoading message="Cargando..." /> : null}`
        );
        modified = true;
      }
      
      // Buscar patrones más complejos
      const complexLoadingPattern = /\{(loading|isLoading)\s*\?\s*\([\s\S]*?Loading[\s\S]*?\)\s*:\s*[\s\S]*?\}/gi;
      if (complexLoadingPattern.test(content) && !content.includes('PageLoading')) {
        const matches = content.match(complexLoadingPattern);
        if (matches) {
          matches.forEach(match => {
            content = content.replace(
              match,
              match.replace(/(\([\s\S]*?Loading[\s\S]*?\))/, '<PageLoading message="Cargando..." />')
            );
          });
          modified = true;
        }
      }
    }
    
    if (modified) {
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Loading states optimized in ${pageConfig.path}`);
    } else {
      console.log(`ℹ️  ${pageConfig.path}: Already optimized or no loading states found`);
    }
  }
}

// Ejecutar optimización
if (require.main === module) {
  const optimizer = new LoadingStatesOptimizer();
  optimizer.optimizeLoadingStates();
}

export { LoadingStatesOptimizer };

