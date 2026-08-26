import type { CvData } from '../../domain/entities/cv-data';
import type { TemplateConfig } from '../../domain/entities/template-config';

interface Props {
  data: CvData;
  config: TemplateConfig;
}

function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <h3
        className="mb-1 border-b pb-0.5 text-[9.5pt] font-bold uppercase"
        style={{ color: '#1A1A2E', borderColor: '#1A1A2E40' }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function SideEntry({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-1.5">
      <p className="text-[8.5pt] leading-tight">{title}</p>
      <p className="text-[7.5pt] leading-tight" style={{ color: '#555555' }}>
        {subtitle}
      </p>
    </div>
  );
}

export function CvPreviewSidebar({ data }: Props) {
  return (
    <div className="space-y-3">
      {/* Contact */}
      <div className="text-[8.5pt] leading-relaxed">
        <p>{data.phone}</p>
        <p>{data.email}</p>
        <p>{data.city}</p>
      </div>

      {/* About */}
      {data.aboutMe && (
        <SideSection title="Sobre Mí">
          <p className="text-[8.5pt] leading-snug">{data.aboutMe}</p>
        </SideSection>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <SideSection title="Educación">
          {data.education.map((e, i) => (
            <SideEntry key={i} title={e.title} subtitle={e.subtitle} />
          ))}
        </SideSection>
      )}

      {/* Courses */}
      {data.courses.length > 0 && (
        <SideSection title="Cursos">
          {data.courses.map((c, i) => (
            <SideEntry key={i} title={c.title} subtitle={c.subtitle} />
          ))}
        </SideSection>
      )}

      {/* Extracurricular */}
      {data.extracurricular.length > 0 && (
        <SideSection title="Actividades Extracurriculares">
          {data.extracurricular.map((a, i) => (
            <SideEntry key={i} title={a.title} subtitle={a.subtitle} />
          ))}
        </SideSection>
      )}
    </div>
  );
}
