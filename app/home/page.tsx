// pages/index.tsx
"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { fetchPullRequests, analyzePullRequest } from "../lib/github";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Dropdown,
  Spacer,
  Spinner,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const [userRepositories, setUserRepositories] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [pullRequests, setPullRequests] = useState<any[]>([]);
  const [analyzedPR, setAnalyzedPR] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserRepositories = async () => {
      if (session?.user) {
        const response = await fetch(
          `/api/repositories?userId=${session.user.name}`
        );
        const data = await response.json();
        setUserRepositories(data);
      }
    };
    fetchUserRepositories();
  }, [session]);

  const handleRepoChange = async (repoUrl: string | null) => {
    console.log("repourl", repoUrl);
    setSelectedRepo(repoUrl);
    if (repoUrl) {
      const prs = await fetchPullRequests(repoUrl);
      setPullRequests(prs);
    } else {
      setPullRequests([]);
    }
  };

  const handleAnalyzePR = async (prId: string) => {
    setIsLoading(true);
    const analysis = await analyzePullRequest(selectedRepo!, prId);
    setAnalyzedPR(analysis);
    setIsLoading(false);
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-4">Code Review Tool</h1>
      <h3 className="text-2xl mb-4">Welcome!</h3>
      <Button onClick={() => router.push("/link-repository")}>
        Link a new repository
      </Button>
      <Spacer y={2} />
      <Dropdown>
        <DropdownTrigger>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            {"Choose repository to review"}
          </button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Linked Repositories"
          onAction={(repoUrl) => handleRepoChange(repoUrl as string)}
          selectedKeys={selectedRepo ? [selectedRepo] : []}
          selectionMode="single"
        >
          {userRepositories.map((repo) => (
            <DropdownItem key={repo.url} textValue={repo.url}>
              {repo.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <Spacer y={2} />
      {selectedRepo && (
        <div>
          {/* <h4 className="text-xl mb-2">Pull Requests:</h4> */}
          <Dropdown>
            <DropdownTrigger>
              <Button className="px-4 py-2 bg-blue-500 text-white rounded">
                Select a pull request to analyse
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Pull Requests"
              onAction={(prId) => handleAnalyzePR(prId as string)}
            >
              {pullRequests.map((pr) => (
                <DropdownItem key={pr.number} textValue={pr.title}>
                  {pr.title}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      )}
      <Spacer y={2} />
      {isLoading ? (
        <Spinner />
      ) : (
        analyzedPR && (
          <div className="flex">
            <div className="flex-1">
              <h4 className="text-xl mb-2">Files</h4>
              {analyzedPR.codeAnalysis.map((analysis: any) => (
                <div key={analysis.filename}>
                  <p>{analysis.filename}</p>
                </div>
              ))}
            </div>
            <Spacer x={2} />
            <div className="flex-2">
              <h4 className="text-xl mb-2">Code Analysis</h4>
              {analyzedPR.codeAnalysis.map((analysis: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <p className="font-bold">{analysis.filename}</p>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <p>{analysis.analysis}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
