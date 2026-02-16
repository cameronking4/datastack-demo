import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1">
      <section className="flex flex-col items-center justify-center text-center py-24 px-6">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
          DataStack
        </h1>
        <p className="text-lg text-fd-muted-foreground max-w-2xl mb-8">
          A unified data platform for provisioning and managing compute
          clusters, pipelines, jobs, notebooks, and SQL warehouses through a
          single REST API.
        </p>
        <div className="flex flex-row gap-4">
          <Link
            href="/docs"
            className="rounded-lg bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground shadow hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
          <Link
            href="/docs/api-reference"
            className="rounded-lg border border-fd-border px-6 py-3 text-sm font-medium hover:bg-fd-accent transition-colors"
          >
            API Reference
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6 pb-24">
        <FeatureCard
          title="Compute Management"
          description="Create, resize, and manage compute clusters and SQL warehouses with autoscaling and auto-termination."
          href="/docs/api-reference/clusters"
        />
        <FeatureCard
          title="Data Pipelines"
          description="Define Delta Live Tables pipelines, monitor events, and orchestrate scheduled jobs."
          href="/docs/api-reference/pipelines"
        />
        <FeatureCard
          title="Notebooks & SQL"
          description="Develop multi-language notebooks and execute analytical queries through managed warehouses."
          href="/docs/api-reference/notebooks"
        />
        <FeatureCard
          title="Authentication"
          description="OAuth2 tokens with scoped permissions and long-lived API keys for machine-to-machine access."
          href="/docs/getting-started/authentication"
        />
        <FeatureCard
          title="Webhooks"
          description="Receive real-time event notifications for job completions, pipeline updates, and cluster changes."
          href="/docs/api-reference/webhooks"
        />
        <FeatureCard
          title="Workspace Isolation"
          description="Organize resources across workspaces with role-based access control and scoped credentials."
          href="/docs/api-reference/workspaces"
        />
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-fd-border p-6 hover:border-fd-primary/50 hover:bg-fd-accent/50 transition-colors"
    >
      <h3 className="text-base font-semibold mb-2 group-hover:text-fd-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-fd-muted-foreground">{description}</p>
    </Link>
  );
}
